import Membership from "../model/membership.model.js";
import User from "../model/user.model.js";
import Razorpay from "razorpay";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import responder from "../utils/responder.js";
import getUserIdFromSession from "../utils/getUserID.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export const buyMembership = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    if (!userId) {
      return responder(res, null, "Unauthorized: No session token", false, 401);
    }

    const { planName, price, duration, paymentId } = req.body;

    let userMembership = await Membership.findOne({ userId, status: "active" });
    if (userMembership) {
      const currentExpiry = userMembership.expiryDate;
      const durationInMonths = Number(duration);
      const newExpiryDate = new Date(currentExpiry);
      newExpiryDate.setMonth(newExpiryDate.getMonth() + durationInMonths);
      userMembership.expiryDate = newExpiryDate;
      userMembership.paymentIds.push(paymentId);
      await userMembership.save();
      return responder(res, userMembership, "Membership extended successfully!", true, 200);
    } else {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + Number(duration));
      const newMembership = new Membership({
        userId,
        planName,
        price,
        expiryDate,
        paymentIds: [paymentId],
        status: "active",
      });
      await newMembership.save();
      return responder(res, newMembership, "Membership activated!", true, 201);
    }
  } catch (error) {
    console.error("Error in buyMembership:", error.message);
    return responder(res, null, "Server error", false, 500);
  }
};

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    
    // Validate amount
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return responder(res, null, "Invalid amount provided", false, 400);
    }

    // Prepare options (amount converted to paise)
    const options = {
      amount: Number(amount) * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    console.log("Creating Razorpay order with options:", options);

    const order = await razorpay.orders.create(options);
    console.log("Order created:", order);

    return responder(
      res,
      { orderId: order.id, amount: order.amount },
      "Order created successfully",
      true,
      201
    );
  } catch (error) {
    console.error("Error in createOrder:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    return responder(res, null, error.message || "Error creating order", false, 500);
  }
};


export const getMembership = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    if (!userId) {
      return responder(res, null, "Unauthorized: No session token", false, 401);
    }
    const memberships = await Membership.find({ userId, status: "active" });
    if (!memberships || memberships.length === 0) {
      return responder(res, null, "No active membership found", false, 404);
    }
    return responder(res, memberships, "Membership retrieved successfully", true, 200);
  } catch (error) {
    console.error("Error in getMembership:", error.message);
    return responder(res, null, "Server error", false, 500);
  }
};

export const cancelMembership = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    if (!userId) {
      return responder(res, null, "Unauthorized: No session token", false, 401);
    }
    const { membershipId } = req.body;
    if (!membershipId) {
      return responder(res, null, "Membership ID is required", false, 400);
    }
    const membership = await Membership.findOne({ _id: membershipId, userId, status: "active" });
    if (!membership) {
      return responder(res, null, "No active membership found to cancel", false, 404);
    }
    membership.status = "cancelled";
    await membership.save();
    return responder(res, membership, "Membership cancelled successfully", true, 200);
  } catch (error) {
    console.error("Error in cancelMembership:", error.message);
    return responder(res, null, "Server error", false, 500);
  }
};

export const checkMembership = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    if (!userId) {
      return responder(res, null, "Unauthorized: No session token", false, 401);
    }
    const memberships = await Membership.find({
      userId,
      status: "active",
      expiryDate: { $gte: new Date() }
    }).sort({ expiryDate: -1 });
    if (memberships.length === 0) {
      return responder(res, { valid: false }, "No active membership found", true, 200);
    }
    const responseData = {
      valid: true,
      memberships: memberships.map((membership) => ({
        planName: membership.planName,
        expiryDate: membership.expiryDate,
        status: membership.status,
      }))
    };
    return responder(res, responseData, "Membership status retrieved successfully", true, 200);
  } catch (error) {
    console.error("Error in checkMembership:", error.message);
    return responder(res, null, "Server error", false, 500);
  }
};
