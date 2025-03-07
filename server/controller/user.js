import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import responder from "../utils/responder.js";
import getUserIdFromSession from "../utils/getUserID.js";
import Membership from "./../model/membership.model.js";

const postSignup = async (req, res) => {
  const { user, password, email, role } = req.body;
  if (!user || !password || !email) {
    return res.json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      user,
      password: hashedPassword,
      email,
      role: role ? role.toUpperCase() : "USER",
    });
    await newUser.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.json({ message: err.message });
  }
};
 const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Incorrect password." });
    }
    
    const userInfo = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      membership: user.membership,
    };

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    
    const cookieOptions = {
      domain: process.env.COOKIE_DOMAIN || ".onrender.com", 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None", 
      maxAge: 24 * 60 * 60 * 1000, 
      domain: process.env.COOKIE_DOMAIN || ".onrender.com",
    };

    res.cookie("token", token, cookieOptions);
    res.cookie("user-info", JSON.stringify(userInfo), cookieOptions);
    
    return res.status(200).json({
      success: true,
      message: "Login successful",
      userResponse: userInfo,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getUserRole = async (req, res) => {
  const userId = getUserIdFromSession(req);
  if (!userId) {
    return responder(res, null, "Unauthorized: No session token", false, 401);
  }
  try {
    const user = await User.findById(userId).select("role");
    if (!user) {
      return responder(res, null, "User not found", false, 404);
    }
    return responder(res, { role: user.role, id: user._id }, "User role retrieved successfully", true, 200);
  } catch (error) {
    return responder(res, null, error.message, false, 500);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    if (!userId) {
      return responder(res, null, "Unauthorized: No session token", false, 401);
    }

    const user = await User.findById(userId).select("profilePhoto membershipExpiry");
    if (!user) {
      return responder(res, null, "User not found", false, 404);
    }
    return responder(res, { user }, "User profile fetched successfully", true, 200);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return responder(res, null, error.message, false, 500);
  }
};

export { postSignup, postLogin, getUserRole, getUserProfile };
