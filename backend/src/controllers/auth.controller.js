import { User } from "../models/user.model.js";
import { createToken } from "../utils/jwtHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(new ApiResponse(400, null, "User already exists"));
        }

        const user = await User.create({ name, email, password });

        const token = createToken(user);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json(
            new ApiResponse(201, {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }, "User registered successfully")
        );
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(new ApiResponse(400, null, "Email and password are required"));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json(new ApiResponse(401, null, "Invalid email or password"));
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json(new ApiResponse(401, null, "Invalid email or password"));
        }

        const token = createToken(user);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json(
            new ApiResponse(200, {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }, "Login successful")
        );
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

export const logoutUser = async (_req, res) => {
    try {
        res.clearCookie("authToken");
        return res.json(new ApiResponse(200, null, "Logout successful"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};
