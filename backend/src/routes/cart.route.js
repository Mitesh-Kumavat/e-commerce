import express from "express";
import { verifyUser } from "../middleware/verifyAuth.js";
import { addToCart, getUserCart, removeFromCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", verifyUser, addToCart);
router.get("/", verifyUser, getUserCart);
router.delete("/remove/:productId", verifyUser, removeFromCart);

export default router;
