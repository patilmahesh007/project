import express from "express";
import upload from "../utils/upload.js";
import { uploadProfilePhotoController } from "../controller/uploadController.js";
import verify from "../middleware/verify.js";

const router = express.Router();

router.post(
  "/uploadProfilePhoto",
  upload.single("file"),verify,
  uploadProfilePhotoController
);

export default router;
