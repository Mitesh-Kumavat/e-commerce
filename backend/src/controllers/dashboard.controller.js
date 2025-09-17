import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isDeleted: false });
        const totalProducts = await Product.countDocuments({ isDeleted: false });
        const totalOrders = await Order.countDocuments({ status: { $ne: "Cancelled" } });
        const totalRevenueAgg = await Order.aggregate([
            { $match: { status: { $ne: "Cancelled" } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = totalRevenueAgg[0]?.total || 0;

        const recentOrders = await Order.find({ status: { $ne: "Cancelled" } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email")
            .populate("items.product", "name price");

        const topProductsAgg = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.product", count: { $sum: "$items.quantity" } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        const topProducts = await Product.find({
            _id: { $in: topProductsAgg.map(p => p._id) }
        }).select("name images price stock");

        return res.json(
            new ApiResponse(200, {
                summary: {
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    totalRevenue,
                },
                recentOrders,
                topProducts,
            }, "Admin dashboard data fetched successfully")
        );
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};
