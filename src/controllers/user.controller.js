import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const options = {
	httpOnly: true,
	secure: true,
};

const newToken = (user) => {
	return jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
	});
};

const createUserHandler = async (req, res, isAdmin = false) => {
	const { name, username, password } = req.body;

	if ([name, username, password].some((field) => !field.trim())) {
		throw new ApiError(400, "All fields are required");
	}

	const existedUser = await User.findOne({ username });
	if (existedUser) throw new ApiError(403, "User with the same username already exists");

	const user = await User.create({
		username,
		name,
		password,
		isAdmin,
	});

	const registeredUser = await User.findById(user._id).select("-password");

	if (!registeredUser) throw new ApiError(500, "Something went wrong while registering the user");

	return res.status(201).json(new ApiResponse(200, registeredUser, "User created successfully"));
};

export const createAdmin = asyncHandler(async (req, res) => {
	return createUserHandler(req, res, true);
});

export const createUser = asyncHandler(async (req, res) => {
	return createUserHandler(req, res);
});

export const editUser = asyncHandler(async (req, res) => {
	const { name, username, password } = req.body;
	if (!username && !name && !password) throw new ApiError(400, "Field is required");

	const { userId } = req.params;
	const user = await User.findById(userId);

	if (password && user.username !== username) user.password = password;
	if (username && user.username !== username) user.username = username;
	if (name && user.name !== name) user.name = name;

	await user.save({ validateBeforeSave: false });
	const userWithoutPassword = user.toObject();
	delete userWithoutPassword.password;

	return res
		.status(200)
		.json(new ApiResponse(200, userWithoutPassword, "User updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	const user = await User.findByIdAndDelete(userId);
	if (!user) throw new ApiError(404, "User not found");

	return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
	const { username, password } = req.body;
	if (!username) throw new ApiError(400, "username is required");

	const user = await User.findOne({ username });
	if (!user) throw new ApiError(404, "User does not exist");

	const validPassword = await user.isPasswordCorrect(password);
	if (!validPassword) throw new ApiError(401, "Invalid user credentials");

	const token = newToken(user);
	const loggedUser = await User.findById(user._id).select("-password");

	return res
		.status(200)
		.cookie("accessToken", token, options)
		.json(new ApiResponse(200, { loggedUser, token }, "User login successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
	return res
		.status(200)
		.clearCookie("accessToken", options)
		.json(new ApiResponse(200, {}, "User logged out successfully"));
});
