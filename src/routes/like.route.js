import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { toggleLike } from "../controllers/like.controller.js";

const router = Router();

router.use(verifyToken);

router.route("/toggle/:messageId").post(toggleLike);

export default router;
