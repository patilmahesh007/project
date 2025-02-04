import express from "express";
import { generateQRCode, scanQRCode, getQRCode, getScanLogs, expireOldQRCodes } from "../controller/qrScanController.js";

const router = express.Router();

router.post("/generate", generateQRCode);
router.post("/scan", scanQRCode);
router.get("/:userId", getQRCode);
router.get("/logs", getScanLogs);
router.delete("/expire", expireOldQRCodes);

export default router;
