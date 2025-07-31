import {v2 as cloudinary} from 'cloudinary';

// Function to configure and connect to Cloudinary using environment variables
// This should be called before any Cloudinary operations (upload, delete, etc.)
const connectCloudinary = async () => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

export default connectCloudinary;