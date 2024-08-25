import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async (isTest) => {
	try {
		await mongoose.set("strictQuery", true);
		const connectionInstance = await mongoose.connect(
			`${process.env.MONGODB_URI}/${isTest ? "test-db" : DB_NAME}`
		);
		console.log(`Mongoose connection established on ${connectionInstance.connection.host}`);
	} catch (error) {
		console.log("mongoose connection error", error);
		process.exit(1);
	}
};

export const clearDB = async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany({});
	}
};

export const disconnectDB = async () => {
	await mongoose.disconnect();
};

export default connectDB;
