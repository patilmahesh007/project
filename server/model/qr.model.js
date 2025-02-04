import { Schema, model } from "mongoose";

const qrSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user", 
      required: true,
    },
    qrCode: {
      type: String, 
      required: true,
    },
    expiryDate: {
      type: Date, 
      required: true,
    },
    scanned: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

export default model("QrCode", qrSchema);
