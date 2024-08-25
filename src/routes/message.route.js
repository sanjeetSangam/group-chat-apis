import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
	createMessage,
	deleteMessage,
	editMessage,
	getGroupMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.use(verifyToken);

router.route("/:groupId/get").get(getGroupMessage);
router.route("/:groupId/create").post(createMessage);
router.route("/edit/:messageId").patch(editMessage);
router.route("/delete/:messageId").delete(deleteMessage);

export default router;
