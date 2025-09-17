import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ $and: [{ isDeleted: false }, { role: "user" }] }).select('-password').lean();

        if (!users || users.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "No users found"));
        }

        const usersWithOrders = await Promise.all(users.map(async (user) => {
            const orderCount = await Order.countDocuments({ user: user._id });
            return { ...user, totalOrders: orderCount };
        }));

        return res.status(200).json(new ApiResponse(200, usersWithOrders, "Users retrieved successfully"));

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').lean();

        if (!user || user.isDeleted) {
            return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }

        const orderCount = await Order.countDocuments({ user: user._id });
        user.totalOrders = orderCount;

        return res.status(200).json(new ApiResponse(200, user, "User retrieved successfully"));

    }
    catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.isDeleted) {
            return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }

        if (user.role === "admin") {
            return res.status(403).json(new ApiResponse(403, null, "Cannot delete admin user"));
        }

        user.isDeleted = true;
        await user.save();

        return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || user.isDeleted) {
            return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }

        const { name, email } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        return res.status(200).json(new ApiResponse(200, user, "User updated successfully"));

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};
