import { Router } from "express";
import {
	createUser,
	deleteUser,
	editUser,
	loginUser,
	logoutUser,
} from "../controllers/user.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/create").post(verifyAdmin, createUser);
router.route("/edit/:userId").patch(verifyAdmin, editUser);
router.route("/delete/:userId").delete(verifyAdmin, deleteUser);

export default router;
