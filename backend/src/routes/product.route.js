import express from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { verifyAdmin } from "../middleware/verifyAuth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// api/products?keyword=shoes
// api/products?category=footwear&minPrice=1000&maxPrice=5000
// api/products?sort=price_low    or price_high    or latest
router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", verifyAdmin, upload.array("images", 5), createProduct);
router.put("/:id", verifyAdmin, upload.array("images", 5), updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;
