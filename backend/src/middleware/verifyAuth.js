import { ApiResponse } from "../utils/apiResponse.js";
import { verifyToken } from "../utils/jwtHandler.js";

export const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;

        if (!token) return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));

        const decoded = await verifyToken(token);
        if (!decoded) return res.status(403).json(new ApiResponse(403, null, "Invalid token"));

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, "Server error"));
    }
};

export const verifyAdmin = async (req, res, next) => {
    await verifyUser(req, res, async () => {
        if (req.user.role !== "admin") {
            return res.status(403).json(new ApiResponse(403, null, "Admin access only"));
        }
        next();
    });
};
