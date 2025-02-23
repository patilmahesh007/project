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
    }); await newUser.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.json({ message: err.message });
  }
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ message: "Invalid credentials" });
    }

    const membership = await Membership.findOne({ userId: user._id });

    const userResponse = {
      _id: user._id,
      name: user.user,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      membership: {
        isActive: membership ? membership.isActive : false,
        expiryDate: membership ? membership.expiryDate : null,
      }
    };

    const jwtToken = jwt.sign({ userResponse }, process.env.JWT_SECRET, { expiresIn: "24h" });
    req.session.token = jwtToken;
    
    console.log(req.session.token)
    res.json({ success: true, message: "Login successful", userResponse });
  } catch (err) {
    console.error("Login error:", err);
    res.json({ message: err.message });
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
