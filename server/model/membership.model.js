import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planName: { type: String, required: true }, //x "Monthly", "Yearly"
  price: { type: Number, required: true },
  startDate: { type: Date, default: Date.now }, 
  expiryDate: { type: Date, required: true }, 
  status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
  paymentId: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Membership", membershipSchema);
