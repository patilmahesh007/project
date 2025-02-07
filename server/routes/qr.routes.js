import express from "express";
import { generateQRCode , scanQRCode , getQRCode , getScanLogs , expireOldQRCodes  } from "../controller/qrScanController.js";
import verify from "../middleware/verify.js";
const router = express.Router();

router.post("/generate", verify,generateQRCode );
router.post("/scan", verify,scanQRCode );
router.get("/getqr",verify, getQRCode );
router.get("/logs",verify, getScanLogs );
router.delete("/cleanup", verify,expireOldQRCodes );

export default router;
