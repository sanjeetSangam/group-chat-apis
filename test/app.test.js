import request from "supertest";
import app from "../src/app.js";
import connectDB from "../src/db/index.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

beforeAll(async () => {
	await connectDB(true);
});

describe("Test the app", () => {
	let adminToken;
	let userID;
	let groupId;
	let messageId;
	let normalUserId;

	describe("Create admin for testing", () => {
		test("should create a new admin user", async () => {
			const response = await request(app)
				.post("/api/v1/users/admin/create")
				.send({ username: "admin", password: "admin", name: "Admin" });

			expect(response.status).toBe(201);
			expect(response.body.data.username).toBe("admin");
		});

		test("should login admin user", async () => {
			const response = await request(app)
				.post("/api/v1/users/login")
				.send({ username: "admin", password: "admin" });
			adminToken = response.body.data.token;
			expect(response.status).toBe(200);
			expect(response.body.data.loggedUser.username).toBe("admin");
		});
	});

	describe("testing admin user functionality", () => {
		test("should create a new user", async () => {
			const response = await request(app)
				.post("/api/v1/users/create")
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ username: "newuser", password: "newpass", name: "John" });
			normalUserId = response.body.data._id;

			expect(response.status).toBe(201);
			expect(response.body.data.username).toBe("newuser");
		});

		test("should edit existing user", async () => {
			const response = await request(app)
				.patch(`/api/v1/users/edit/${normalUserId}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ username: "updated_username", name: "updated_Jhon" });

			expect(response.status).toBe(200);
			expect(response.body.data.username).toBe("updated_username");
		});
	});

	describe("testing normal user functionality", () => {
		test("should create a new user", async () => {
			const response = await request(app)
				.post("/api/v1/users/create")
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ username: "newuser", password: "newpass", name: "John" });

			userID = response.body.data._id;

			expect(response.status).toBe(201);
			expect(response.body.data.username).toBe("newuser");
		});
	});

	describe("testing group functionality", () => {
		test("should create a new group", async () => {
			const response = await request(app)
				.post("/api/v1/group/create")
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ name: "group1" });

			groupId = response.body.data._id;

			expect(response.status).toBe(201);
			expect(response.body.data.name).toBe("group1");
		});

		test("should be able to add new member to group", async () => {
			const response = await request(app)
				.patch(`/api/v1/group/add-members/${groupId}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ memberIds: [userID] });

			expect(response.status).toBe(200);
			expect(response.body.data.members.length).toBe(2);
		});

		test("should able to get groups for the user", async () => {
			const response = await request(app)
				.get(`/api/v1/group/fetch`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(response.status).toBe(200);
			expect(response.body.data.length).toBe(1);
		});

		test("should able to get groups members", async () => {
			const response = await request(app)
				.get(`/api/v1/group/${groupId}/members`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(response.status).toBe(200);
			expect(response.body.data.members.length).toBe(2);
		});

		test("should able to remove member from group", async () => {
			const response = await request(app)
				.patch(`/api/v1/group/remove-members/${groupId}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ memberIds: [userID] });

			expect(response.status).toBe(200);
			expect(response.body.data.members.length).toBe(1);
		});
	});

	describe("testing messages functionality", () => {
		test("should be able to create messages", async () => {
			const response = await request(app)
				.post(`/api/v1/message/${groupId}/create`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ content: "random message." });

			messageId = response.body.data._id;

			expect(response.status).toBe(201);
			expect(response.body.data.content).toBe("random message.");
		});

		test("should be able to update messages", async () => {
			const response = await request(app)
				.patch(`/api/v1/message/edit/${messageId}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ content: "random message2." });

			expect(response.status).toBe(200);
			expect(response.body.data.content).toBe("random message2.");
		});

		test("should be able to get group messages", async () => {
			const response = await request(app)
				.get(`/api/v1/message/${groupId}/get`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(response.status).toBe(200);
			expect(response.body.data.messages.length).toBeTruthy();
		});
	});

	describe("user should be able to add and remove like message", () => {
		test("should be able to give like", async () => {
			const response = await request(app)
				.post(`/api/v1/like/toggle/${messageId}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(response.status).toBe(201);
			expect(response.body.data).toBeTruthy();
		});

		test("should be able to remove like", async () => {
			const response = await request(app)
				.post(`/api/v1/like/toggle/${messageId}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(response.status).toBe(200);
		});
	});

	describe("user should be able to delete", () => {
		test("message", async () => {
			const response = await request(app)
				.delete(`/api/v1/message/delete/${messageId}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(response.status).toBe(200);
		});

		test("group", async () => {
			const response = await request(app)
				.delete(`/api/v1/group/delete/${groupId}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(response.status).toBe(200);
		});

		test("user by admin", async () => {
			const response = await request(app)
				.delete(`/api/v1/users/delete/${normalUserId}`)
				.set("Authorization", `Bearer ${adminToken}`);
			await request(app)
				.delete(`/api/v1/users/delete/${userID}`)
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.status).toBe(200);
		});
	});

	describe("should be able to", () => {
		test("logout", async () => {
			const response = await request(app)
				.get(`/api/v1/users/logout`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(response.status).toBe(200);
		});
	});
});

async function disconnect() {
	await mongoose.disconnect();
}

afterAll(async () => {
	await clearDatabase();
	await disconnect();
});

async function clearDatabase() {
	const collections = Object.keys(mongoose.connection.collections);
	for (const collectionName of collections) {
		const collection = mongoose.connection.collections[collectionName];
		await collection.deleteMany({});
	}
}
