import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const checkout = async (req, res) => {
    try {
        const { address } = req.body;

        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole !== "user") {
            return res.status(403).json(new ApiResponse(403, null, "Only users can checkout"));
        }

        if (!address) {
            return res.status(400).json(new ApiResponse(400, null, "Address is required"));
        }

        const cart = await Cart.findOne({ user: userId }).populate("items.product", "price quantity");



        if (!cart || cart.items.length === 0) {
            return res.status(400).json(new ApiResponse(400, null, "Cart is empty"));
        }
        const productsIds = cart.items.map(item => item.product);

        for (let i = 0; i < productsIds.length; i++) {
            const product = await Product.findById(productsIds[i]);
            if (product.stock < cart.items[i].quantity) {
                return res.status(400).json(new ApiResponse(400, null, `Insufficient stock for product ${product.name}`));
            }
        }

        let totalAmount = 0;

        cart.items.forEach(item => {
            totalAmount += item.product.price * item.quantity;
        });

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5);

        const order = await Order.create({
            user: userId,
            items: cart.items,
            totalAmount,
            address,
            deliveryDate
        });

        for (let i = 0; i < productsIds.length; i++) {
            const product = await Product.findById(productsIds[i]);
            product.stock -= cart.items[i].quantity;
            await product.save();
        }

        cart.items = [];

        await cart.save();

        return res.status(201).json(new ApiResponse(201, order, "Order placed successfully"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ user: userId })
            .populate("items.product", "name price images");

        return res.json(new ApiResponse(200, orders, "Orders fetched successfully"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order.status === "cancelled") {
            return res.status(400).json(new ApiResponse(400, null, "Order is already cancelled"));
        }

        if (!order) {
            return res.status(404).json(new ApiResponse(404, null, "Order not found"));
        }

        if (order.status === "delivered" || order.deliveryDate < new Date()) {
            return res.status(400).json(new ApiResponse(400, null, "Delivered Order cannot be cancelled"));
        }

        order.status = "cancelled";

        for (let i = 0; i < order.items.length; i++) {
            const product = await Product.findById(order.items[i].product);
            product.stock += order.items[i].quantity;
            await product.save();
        }


        await order.save();

        return res.json(new ApiResponse(200, order, "Order cancelled successfully"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};

// Admin - Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email");
        return res.json(new ApiResponse(200, orders, "All orders fetched successfully"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};

// Admin - Total expenses for a user
export const getUserExpenses = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId, status: { $ne: "Cancelled" } });

        const total = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        return res.json(new ApiResponse(200, { userId, total }, "User expenses fetched successfully"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};

// Admin - Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;
        const validStatuses = ["pending", "shipped", "delivered", "cancelled"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid status"));
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json(new ApiResponse(404, null, "Order not found"));
        }

        if (order.status === "cancelled") {
            return res.status(400).json(new ApiResponse(400, null, "Cannot update a cancelled order"));
        }

        if (order.status === "delivered") {
            return res.status(400).json(new ApiResponse(400, null, "Cannot update a delivered order"));
        }

        if (order.status === status) {
            return res.status(400).json(new ApiResponse(400, null, `Order is already ${status}`));
        }

        if (status === "delivered") {
            order.deliveryDate = new Date();
        }

        order.status = status;

        await order.save();
        return res.json(new ApiResponse(200, order, "Order status updated successfully"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};
