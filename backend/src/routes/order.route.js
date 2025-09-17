import express from "express";
import { verifyUser, verifyAdmin } from "../middleware/verifyAuth.js";
import { checkout, getUserOrders, cancelOrder, getAllOrders, getUserExpenses, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/checkout", verifyUser, checkout);
router.get("/", verifyUser, getUserOrders);
router.put("/cancel/:id", verifyUser, cancelOrder);
router.put("/status/:id", verifyAdmin, updateOrderStatus);
router.get("/admin/all", verifyAdmin, getAllOrders);
router.get("/admin/expenses/:userId", verifyAdmin, getUserExpenses);

export default router;
