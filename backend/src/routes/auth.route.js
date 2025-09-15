import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import { verifyUser } from "../middleware/verifyAuth.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyUser, logoutUser);

export default router;
