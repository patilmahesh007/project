import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import sessionMiddleware from "./middleware/session.js";

import userRoutes from "./routes/user.routes.js";
import membershipRoutes from "./routes/membership.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import qrRoutes from "./routes/qr.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

if (process.env.NODE_ENV==="production") {
  app.set("trust proxy", 1);
}

app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin:  "https://project-1121.onrender.com" 
 , credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(sessionMiddleware);

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

app.use("/auth", userRoutes);
app.use("/membership", membershipRoutes);
app.use("/password", passwordRoutes);
app.use("/qr", qrRoutes);
app.use("/upload", uploadRoutes);
console.log(process.env.NODE_ENV)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
