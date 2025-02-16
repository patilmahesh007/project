import { Schema, model } from "mongoose"; 

const userSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["USER", "ADMIN", "SUPER_ADMIN"],   
      default: "USER",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    dailyQr: {
      qrCode: { type: String },
      expiryDate: { type: Date },
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    membershipExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default model("user", userSchema);
