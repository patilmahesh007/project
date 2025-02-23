import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";



import userRoutes from "./routes/user.routes.js";
import membershipRoutes from "./routes/membership.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import qrRoutes from "./routes/qr.routes.js";
import uploadRoutes from "./routes/upload.routes.js";



const app = express();
app.use(express.json());
dotenv.config();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));




app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60000,
    path: '/',
    domain: '.onrender.com' 
  }
}));


app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

app.use("/auth", userRoutes);
app.use("/membership", membershipRoutes);
app.use("/password", passwordRoutes);
app.use("/qr", qrRoutes);
app.use("/upload", uploadRoutes);


app.use(session({ secret: "secret", cookie: { maxAge: 60000, httpOnly: false, secure: false } }));


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
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
