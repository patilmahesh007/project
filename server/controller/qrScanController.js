import QRCode from "qrcode";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import QRCodeModel from "./../model/qr.model.js";
import User from "../model/user.model.js";

export const generateQRCode = async (req, res) => {
  try {
    const { userId } = req.body;
    const today = moment().startOf("day");

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingQR = await QRCodeModel.findOne({
      userId,
      createdAt: { $gte: today.toDate() },
    });

    if (existingQR) {
      return res.json({ qrId: existingQR.qrId, qrCode: existingQR.qrCode });
    }

    const qrId = uuidv4();

    const qrData = JSON.stringify({ qrId, userId });

    const qrCodeBase64 = await QRCode.toDataURL(qrData);

    const expiryDate = moment().endOf("day").toDate();

    const newQRCode = new QRCodeModel({ userId, qrId, qrCode: qrCodeBase64, expiryDate });
    await newQRCode.save();

    res.json({ qrId, qrCode: qrCodeBase64 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const scanQRCode = async (req, res) => {
  try {
    const { userId, qrId } = req.body;

    const today = moment().startOf("day");
    const validQR = await QRCodeModel.findOne({
      userId,
      qrId,  // Check QR ID & User ID
      createdAt: { $gte: today.toDate() },
    });

    if (!validQR) return res.status(400).json({ message: "Invalid or expired QR code" });

    if (validQR.scanned) {
      return res.status(400).json({ message: "QR code already used" });
    }

    validQR.scannedAt = new Date();
    validQR.scanned = true;
    await validQR.save();

    res.json({ message: "Entry granted", userId, qrId, scanTime: validQR.scannedAt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQRCode = async (req, res) => {
  try {
    const { userId } = req.body;
    const today = moment().startOf("day");

    const qrCode = await QRCodeModel.findOne({
      userId,
      createdAt: { $gte: today.toDate() },
    });

    if (!qrCode) return res.status(404).json({ message: "No QR code found for today" });

    res.json({ qrId: qrCode.qrId, qrCode: qrCode.qrCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getScanLogs = async (req, res) => {
  try {
    const logs = await QRCodeModel.find().sort({ createdAt: -1 });
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const expireOldQRCodes = async (req, res) => {
  try {
    const yesterday = moment().subtract(1, "day").endOf("day");
    await QRCodeModel.deleteMany({ createdAt: { $lte: yesterday.toDate() } });

    res.json({ message: "Expired QR codes deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
