import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //console.log("File uploaded to Cloudinary:", response.url);
    fs.unlinkSync(localFilePath); // Remove the locally saved temp file after upload

    return response;
  } catch (error) {
    // Remove the locally saved temp file if upload fails
    fs.unlinkSync(localFilePath);
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

export { uploadOnCloudinary };
