import express from "express";
import { generateQRCode , scanQRCode , getQRCode , getScanLogs , expireOldQRCodes  } from "../controller/qrScanController.js";
import verify from "../middleware/verify.js";
const router = express.Router();

router.post("/api/generate", verify,generateQRCode );
router.post("/api/scan", verify,scanQRCode );
router.get("/api/getqr",verify, getQRCode );
router.get("/api/logs",verify, getScanLogs );
router.delete("/api/cleanup", verify,expireOldQRCodes );

export default router;
