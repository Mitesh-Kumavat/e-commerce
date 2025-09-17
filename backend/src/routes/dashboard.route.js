import express from "express";
import { verifyAdmin } from "../middleware/verifyAuth.js";
import { getAdminDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", verifyAdmin, getAdminDashboard);

export default router;
