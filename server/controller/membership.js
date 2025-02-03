import Membership from "../model/membership.model.js";
import User from "./../model/user.model.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID||"",
  key_secret: process.env.RAZORPAY_KEY_SECRET||"",
});

export const buyMembership = async (req, res) => {
  try {
    const { userId, planName, price, duration, paymentId } = req.body;

    let userMembership = await Membership.findOne({ userId, status: "active" });

    if (userMembership) {
      const currentExpiry = userMembership.expiryDate;
      const durationInMonths = Number(duration);

      const newExpiryDate = new Date(currentExpiry);
      newExpiryDate.setMonth(newExpiryDate.getMonth() + durationInMonths);

      userMembership.expiryDate = newExpiryDate;
      userMembership.status = "active"; 
      await userMembership.save();

      return res.status(200).json({
        message: "Membership extended successfully!",
        membership: userMembership,
      });
    } else {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + Number(duration));

      const newMembership = new Membership({
        userId,
        planName,
        price,
        expiryDate,
        paymentId,
        status: "active",
      });

      await newMembership.save();

      return res.status(201).json({
        message: "Membership activated!",
        membership: newMembership,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    const options = {
      amount: amount * 100, 
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    res.status(500).json({ error: "Error creating order", details: error.message });
  }
};
export const getMembership = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const membership = await Membership.find({ userId, status: "active" });
    if (!membership) return res.status(404).json({ error: "No active membership found" });

    res.status(200).json(membership);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
export const cancelMembership = async (req, res) => {
  try {
    const { userId, membershipId } = req.body;

    if (!userId || !membershipId) {
      return res.status(400).json({ error: "User ID and membershipID are required" });
    }
    const membership = await Membership.findOne({ _id: membershipId, userId, status: "active" });
    if (!membership) {
      return res.status(404).json({ error: "No active membership found to cancel" });
    }

    membership.status = "cancelled";
    await membership.save();

    res.status(200).json({ message: "Membership cancelled successfully", membership });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


export const checkMembership = async (req, res) => {
  try {
    const { userId } = req.params;

    const memberships = await Membership.find({
      userId,
      status: "active",
      expiryDate: { $gte: new Date() }
    }).sort({ expiryDate: -1 });

    if (memberships.length === 0) {
      return res.status(200).json({ valid: false, message: "No active membership found" });
    }

    res.status(200).json({
      valid: true,
      memberships: memberships.map((membership) => ({
        planName: membership.planName,
        expiryDate: membership.expiryDate,
        status: membership.status,
      }))
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

