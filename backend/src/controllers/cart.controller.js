import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole !== "user") {
            return res.status(403).json(new ApiResponse(403, null, "Only users can add to cart"));
        }

        if (!productId || !quantity) {
            return res.status(400).json(new ApiResponse(400, null, "Product and quantity required"));
        }

        const product = await Product.findById(productId);

        if (!product || product.isDeleted) {
            return res.status(404).json(new ApiResponse(404, null, "Product not found"));
        }

        if (product.stock < quantity) {
            return res.status(400).json(new ApiResponse(400, null, "Insufficient stock"));
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        return res.json(new ApiResponse(200, cart, "Product added to cart"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};

export const getUserCart = async (req, res) => {
    try {

        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole !== "user") {
            return res.status(403).json(new ApiResponse(403, null, "Only users can view cart"));
        }

        const cart = await Cart.findOne({ user: userId })
            .populate("items.product", "name price images");

        return res.json(new ApiResponse(200, cart || { items: [] }, "Cart fetched successfully"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole !== "user") {
            return res.status(403).json(new ApiResponse(403, null, "Only users can remove from cart"));
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json(new ApiResponse(404, null, "Cart not found"));

        cart.items = cart.items.filter(i => i.product.toString() !== productId);

        await cart.save();
        return res.json(new ApiResponse(200, cart, "Product removed from cart"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};
