import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const uploadResult = await cloudinary.uploader
            .upload(localFilePath, { resource_type: "image", folder: "product_images", access_mode: "public" })
            .catch((error) => {
                console.log("Error while Uploading on Cloudinary", error);
            });

        if (fs.existsSync(localFilePath)) {
            fs.unlink(localFilePath, (err) => {
                if (err) console.log("Error deleting local file:", err.message);
            });
        }
        console.log("File is Uploaded on Cloudinary url: ", uploadResult)
        return uploadResult;
    } catch (error) {
        console.log("ERROR IN CLOUDINARY FILE, ", error)
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null
        const deleteResult = await cloudinary.uploader.destroy(publicId, { resource_type: "image" })
            .catch((error) => {
                console.log("Error while Deleting from Cloudinary", error);
            });
        console.log("File is Deleted from Cloudinary: ", deleteResult)
        return deleteResult;
    } catch (error) {
        console.log("ERROR IN CLOUDINARY FILE DELETION, ", error)
        return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }