// upload.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g., dtrrsp1ll
  api_key: process.env.CLOUDINARY_API_KEY,         // your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET,     // your Cloudinary API secret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_photos', // Change to your preferred folder
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage: storage });

export default upload;
