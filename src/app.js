import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: "30kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use((req, _, next) => {
	req.io = req.app.get("io");
	next();
});

app.get("/", (req, res) => {
	return res.status(200).json({ message: "CONNECTION established" });
});

app.use((err, req, res, next) => {
	res.status(err.statusCode || 500).json({
		status: "error",
		message: err.message || "Internal Server Error",
	});
});

// route imports
import userRoutes from "./routes/user.route.js";
import groupRoutes from "./routes/group.route.js";
import messageRoutes from "./routes/message.route.js";
import likeRoutes from "./routes/like.route.js";

// routes declarations
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/group", groupRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/like", likeRoutes);

export default app;
