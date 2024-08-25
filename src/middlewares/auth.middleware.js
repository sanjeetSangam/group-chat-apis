import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyToken = async (req, _, next) => {
	try {
		const accessToken =
			req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

		if (!accessToken) throw new ApiError(401, "Unauthorized request");
		const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

		const user = await User.findById(decodedToken?.user?._id).select("-password");
		if (!user) throw new ApiError(401, "Invalid Access Token");
		req.user = user;
		next();
	} catch (error) {
		return next(new ApiError(401, error?.message || "Invalid Access Token"));
	}
};

export const verifyAdmin = asyncHandler(async (req, res, next) => {
	await verifyToken(req, res, () => {
		if (req.user.isAdmin) {
			next();
		} else {
			throw new ApiError(403, "Access denied");
		}
	});
});
