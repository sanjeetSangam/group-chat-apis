import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const toggleLike = asyncHandler(async (req, res) => {
	const { messageId } = req.params;
	const likedBy = req?.user?._id;

	const oldLike = await Like.findOneAndDelete({
		message: messageId,
		likedBy: likedBy,
	});

	if (oldLike) {
		return res.status(200).json(new ApiResponse(200, {}, "Like removed successfully"));
	}

	const newLike = await Like.create({ message: messageId, likedBy });

	return res.status(201).json(new ApiResponse(200, newLike, "Like added successfully"));
});
