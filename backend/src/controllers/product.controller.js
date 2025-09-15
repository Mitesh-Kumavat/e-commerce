import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json(new ApiResponse(400, null, "At least one image is required"));
        }

        const uploadPromises = files.map(file => uploadOnCloudinary(file.path));
        const uploadResults = await Promise.all(uploadPromises);

        const images = uploadResults
            .filter(result => result)
            .map(result => ({ url: result.secure_url, public_id: result.public_id }));

        if (images.length === 0) {
            return res.status(400).json(new ApiResponse(400, null, "Image upload failed"));
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            images
        });

        return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};


export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product || product.isDeleted) {
            return res.status(404).json(new ApiResponse(404, null, "Product not found"));
        }

        // If new files uploaded → upload to Cloudinary
        if (req.files && req.files.length > 0) {
            // delete old images
            for (const img of product.images) {
                await deleteFromCloudinary(img.public_id);
            }

            let images = [];
            for (const file of req.files) {
                const result = await uploadOnCloudinary(file.path);
                if (result) {
                    images.push({ url: result.secure_url, public_id: result.public_id });
                }
            }
            product.images = images;
        }

        Object.assign(product, req.body);
        await product.save();

        return res.json(new ApiResponse(200, product, "Product updated successfully"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};

export const getProducts = async (req, res) => {
    try {
        const { keyword, category, minPrice, maxPrice, sort } = req.query;

        let query = { isDeleted: false };

        if (keyword) {
            query.$text = { $search: keyword };
        }

        if (category) {
            query.category = category;
        }

        if (minPrice && maxPrice) {
            query.price = { $gte: minPrice, $lte: maxPrice };
        }

        let products = Product.find(query);

        // sorting
        if (sort === "price_low") products = products.sort({ price: 1 });
        if (sort === "price_high") products = products.sort({ price: -1 });
        if (sort === "latest") products = products.sort({ createdAt: -1 });

        const result = await products;
        return res.json(new ApiResponse(200, result, "Products fetched successfully"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product || product.isDeleted) {
            return res.status(404).json(new ApiResponse(404, null, "Product not found"));
        }

        return res.json(new ApiResponse(200, product, "Product fetched successfully"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product || product.isDeleted) {
            return res.status(404).json(new ApiResponse(404, null, "Product not found"));
        }

        product.isDeleted = true;
        await product.save();

        return res.json(new ApiResponse(200, null, "Product deleted successfully (soft delete)"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, err.message));
    }
};
