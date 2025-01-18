import {v2 as cloudinary}from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (file) => {
   if (!file) return null;
   try{
    const response = await cloudinary.uploader.upload(file,{resource_type:"auto"});
   return response;
   }
   catch{
    fs.unlinkSync(file);
    return null;
   }
}
export {uploadCloudinary}