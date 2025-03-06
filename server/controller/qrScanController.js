import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import QRCodeModel from "./../model/qr.model.js";
import User from "../model/user.model.js";
import Membership from "../model/membership.model.js";
import responder from "../utils/responder.js";

// Helper to get user ID from the "user-info" cookie
const getUserIdFromUserInfoCookie = (req) => {
  try {
    if (!req.cookies || !req.cookies["user-info"]) {
      console.error("user-info cookie not found");
      return null;
    }
    const userInfo = JSON.parse(req.cookies["user-info"]);
    return userInfo._id;
  } catch (error) {
    console.error("Error reading user-info cookie:", error);
    return null;
  }
};

export const generateQRCode = async (req, res) => {
  try {
    console.log("Incoming cookies:", req.cookies);
    const userId = getUserIdFromUserInfoCookie(req);
    if (!userId) {
      return responder(res, null, "Unauthorized: No user info cookie", false, 401);
    }

    const today = moment().startOf("day");
    const user = await User.findById(userId);
    if (!user) {
      return responder(res, null, "User not found", false, 404);
    }

    const membership = await Membership.findOne({ userId, status: "active" });
    if (!membership) {
      return responder(
        res,
        null,
        "No active membership found, cannot generate QR",
        false,
        404
      );
    }

    const existingQR = await QRCodeModel.findOne({
      userId,
      createdAt: { $gte: today.toDate() },
    });
    if (existingQR) {
      return responder(
        res,
        { qrId: existingQR.qrId, qrCode: existingQR.qrCode },
        "QR Code already generated for today",
        true,
        200
      );
    }

    const qrId = uuidv4();
    const qrData = JSON.stringify({ qrId, userId });
    const qrCodeBase64 = await QRCode.toDataURL(qrData);
    const expiryDate = moment().endOf("day").toDate();

    const newQRCode = new QRCodeModel({
      userId,
      qrId,
      qrCode: qrCodeBase64,
      expiryDate,
    });
    await newQRCode.save();

    return responder(
      res,
      { qrId, qrCode: qrCodeBase64 },
      "QR Code generated successfully",
      true,
      200
    );
  } catch (error) {
    console.error("Error in generateQRCode:", error.message);
    return responder(res, null, error.message, false, 500);
  }
};

export const scanQRCode = async (req, res) => {
  try {
    const userId = getUserIdFromUserInfoCookie(req);
    if (!userId) {
      return responder(res, null, "Unauthorized: No user info cookie", false, 401);
    }

    const user = await User.findById(userId);
    if (!user) {
      return responder(res, null, "User not found", false, 404);
    }
    if (!(user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
      return responder(res, null, "Not authorized to scan QR codes", false, 403);
    }

    const { qrId } = req.body;
    if (!qrId) {
      return responder(res, null, "QR ID is required", false, 400);
    }

    const today = moment().startOf("day");
    const validQR = await QRCodeModel.findOne({
      userId,
      qrId,
      createdAt: { $gte: today.toDate() },
    });
    if (!validQR) {
      return responder(res, null, "Invalid or expired QR code", false, 400);
    }
    if (validQR.scanned) {
      return responder(res, null, "QR code already used", false, 400);
    }

    validQR.scannedAt = new Date();
    validQR.scanned = true;
    await validQR.save();

    return responder(
      res,
      { userId, qrId, scanTime: validQR.scannedAt },
      "Entry granted",
      true,
      200
    );
  } catch (error) {
    console.error("Error in scanQRCode:", error.message);
    return responder(res, null, error.message, false, 500);
  }
};

export const getQRCode = async (req, res) => {
  try {
    const userId = getUserIdFromUserInfoCookie(req);
    if (!userId) {
      return responder(res, null, "Unauthorized: No user info cookie", false, 401);
    }

    const today = moment().startOf("day");
    const qrCode = await QRCodeModel.findOne({
      userId,
      createdAt: { $gte: today.toDate() },
    });
    if (!qrCode) {
      return responder(res, null, "No QR code found for today", false, 404);
    }

    return responder(
      res,
      { qrId: qrCode.qrId, qrCode: qrCode.qrCode },
      "QR Code retrieved successfully",
      true,
      200
    );
  } catch (error) {
    console.error("Error in getQRCode:", error.message);
    return responder(res, null, error.message, false, 500);
  }
};

export const getScanLogs = async (req, res) => {
  try {
    const logs = await QRCodeModel.find().sort({ createdAt: -1 });
    return responder(
      res,
      { logs },
      "Scan logs retrieved successfully",
      true,
      200
    );
  } catch (error) {
    console.error("Error in getScanLogs:", error.message);
    return responder(res, null, error.message, false, 500);
  }
};

export const expireOldQRCodes = async (req, res) => {
  try {
    const yesterday = moment().subtract(1, "day").endOf("day");
    await QRCodeModel.deleteMany({
      createdAt: { $lte: yesterday.toDate() },
    });
    return responder(
      res,
      null,
      "Expired QR codes deleted",
      true,
      200
    );
  } catch (error) {
    console.error("Error in expireOldQRCodes:", error.message);
    return responder(res, null, error.message, false, 500);
  }
};
