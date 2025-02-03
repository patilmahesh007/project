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
    resetPasswordToken: {
      type: String, 
    },
    resetPasswordExpire: {
      type: Date, 
    },
  },
  { timestamps: true }
);

export default model("user", userSchema);