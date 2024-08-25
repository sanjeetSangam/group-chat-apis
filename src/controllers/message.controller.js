import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createMessage = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const userId = req?.user?._id;
	const { groupId } = req.params;

	if (!userId) throw new ApiError(400, "Invalid user");
	if (!content) throw new ApiError(400, "Please provide valid content");

	let message = await Message.create({
		content,
		sentBy: userId,
		group: groupId,
	});

	message = await message.populate("sentBy", "-password");

	return res.status(201).json(new ApiResponse(201, message, "Message sent successfully"));
});

export const deleteMessage = asyncHandler(async (req, res) => {
	const { messageId } = req.params;
	const userId = req?.user?._id;
	if (!messageId) throw new ApiError(400, "Invalid Request");
	const message = await Message.findByIdAndDelete({ _id: messageId, sentBy: userId });

	if (!message) {
		throw new ApiError(403, "Message not found");
	}

	return res.status(200).json(new ApiResponse(200, {}, "Message deleted successfully"));
});

export const editMessage = asyncHandler(async (req, res) => {
	const { messageId } = req.params;
	const userId = req?.user?._id;
	const { content } = req.body;

	if (!messageId || !content) {
		throw new ApiError(400, "Invalid Request");
	}

	const message = await Message.findOne({ _id: messageId, sentBy: userId });

	if (!message) {
		throw new ApiError(403, "Message not found");
	}

	message.content = content;
	await message.save();

	return res.status(200).json(new ApiResponse(200, message, "Message edited successfully"));
});

export const getGroupMessage = asyncHandler(async (req, res) => {
	const { groupId } = req.params;
	const { page = 1, limit = 10 } = req.query;
	const skip = (page - 1) * limit;

	if (!groupId) throw new ApiError(400, "Invalid Request");

	const totalMessages = await Message.countDocuments({
		group: new mongoose.Types.ObjectId(groupId),
	});

	const messages = await Message.aggregate([
		{ $match: { group: new mongoose.Types.ObjectId(groupId) } },
		{ $sort: { createdAt: -1 } },
		{ $skip: skip },
		{ $limit: parseInt(limit) },
		{
			$lookup: {
				from: "likes",
				localField: "_id",
				foreignField: "message",
				as: "likes",
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "sentBy",
				foreignField: "_id",
				as: "sentBy",
			},
		},
		{ $unwind: "$sentBy" },
		{
			$project: {
				_id: 1,
				content: 1,
				createdAt: 1,
				updatedAt: 1,
				sentBy: { _id: 1, name: 1, username: 1 },
				likes: {
					count: { $size: "$likes" },
					users: "$likes.likedBy",
				},
			},
		},
	]);

	return res
		.status(200)
		.json(new ApiResponse(200, { messages, totalMessages }, "Messages fetched successfully"));
});
