import express from "express";
import { deleteUser, getAllUsers, getCurrentUser, updateCurrentUser } from "../controllers/user.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/verifyAuth.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllUsers);
router.get("/me", verifyUser, getCurrentUser);
router.put("/me", verifyUser, updateCurrentUser);
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
