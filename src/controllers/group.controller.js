import { Group } from "../models/group.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createGroupChat = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const userId = req?.user?._id;

	if (!name) throw new ApiError(400, "Group name is required");

	const group = await Group.create({
		name,
		createdBy: userId,
		members: [userId],
	});

	return res.status(201).json(new ApiResponse(201, group, "Group created successfully"));
});

export const addMembers = asyncHandler(async (req, res) => {
	const { groupId } = req.params;
	const { memberIds } = req.body;

	if (!groupId || !memberIds) throw new ApiError(400, "Invalid request");

	const group = await Group.findById(groupId);
	if (!group) throw new ApiError(404, "Group not found");

	group.members.push(...memberIds);
	await group.save();

	return res.status(200).json(new ApiResponse(200, group, "Members added successfully"));
});

export const removeMembers = asyncHandler(async (req, res) => {
	const { groupId } = req.params;
	const { memberIds } = req.body;

	if (!groupId || !memberIds) throw new ApiError(400, "Invalid request");

	const group = await Group.findById(groupId);
	if (!group) throw new ApiError(404, "Group not found");

	group.members = group.members.filter((member) => !memberIds.includes(member.toString()));
	await group.save();

	return res.status(200).json(new ApiResponse(200, group, "Members removed successfully"));
});

export const deleteGroup = asyncHandler(async (req, res) => {
	const { groupId } = req.params;

	if (!groupId) {
		throw new ApiError(400, "Group ID and member IDs are required");
	}

	await Group.findByIdAndDelete(groupId);

	return res.status(200).json(new ApiResponse(200, {}, "Group deleted successfully"));
});

export const fetchUserGroups = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	const groups = await Group.find({ members: userId });

	if (!groups || groups.length === 0) {
		return res.status(404).json(new ApiError(404, "No Group not found"));
	}

	res.status(200).json(
		new ApiResponse(200, groups, `${groups.length} Group${groups.length > 1 ? "s" : ""} found`)
	);
});

export const fetchGroupMembers = asyncHandler(async (req, res) => {
	const { groupId } = req.params;

	if (!groupId) throw new ApiError(400, "Invalid group provided");

	const members = await Group.findById(groupId).populate({
		path: "members",
		select: "name username",
	});

	return res
		.status(200)
		.json(new ApiResponse(200, members, `${members.members.length} members found`));
});
