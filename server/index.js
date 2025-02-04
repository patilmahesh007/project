import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRoutes from "./routes/user.routes.js";
import membershipRoutes from "./routes/membership.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import qrRoutes from "./routes/qr.routes.js";

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

app.use("/auth", userRoutes);        
app.use("/membership", membershipRoutes); 
app.use("/password", passwordRoutes);  
app.use("/qr", qrRoutes);

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI); 
      console.log("✅ Database Connected Successfully");
    } catch (error) {
      console.error("❌ Database Connection Failed:", error);
      process.exit(1); 
    }
  };
  

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
