import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
	addMembers,
	createGroupChat,
	deleteGroup,
	fetchGroupMembers,
	fetchUserGroups,
	removeMembers,
} from "../controllers/group.controller.js";

const router = Router();

router.use(verifyToken);

router.route("/create").post(createGroupChat);
router.route("/add-members/:groupId").patch(addMembers);
router.route("/remove-members/:groupId").patch(removeMembers);
router.route("/delete/:groupId").delete(deleteGroup);
router.route("/fetch").get(fetchUserGroups);
router.route("/:groupId/members").get(fetchGroupMembers);

export default router;
