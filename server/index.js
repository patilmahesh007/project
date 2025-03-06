import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";

// Import routes
import userRoutes from "./routes/user.routes.js";
import membershipRoutes from "./routes/membership.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import qrRoutes from "./routes/qr.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// Parse cookies and JSON bodies
app.use(cookieParser());
app.use(express.json());

// Define CORS options for your production frontend
const corsOptions = {
  origin: "https://project-1121.onrender.com", // Frontend URL
  credentials: true,
};

// Use CORS middleware with the defined options
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Configure express-session
app.use(
  session({
    name: "widget_session",
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true, // Ensure HTTPS in production
      sameSite: "none", // Allows cross-site cookies (if needed)
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
      domain: ".onrender.com", // Shared across subdomains of onrender.com
    },
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

// Mount routes
app.use("/auth", userRoutes);
app.use("/membership", membershipRoutes);
app.use("/password", passwordRoutes);
app.use("/qr", qrRoutes);
app.use("/upload", uploadRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
