import express from "express";
import { deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/user.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/verifyAuth.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", verifyUser, updateUser);
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
