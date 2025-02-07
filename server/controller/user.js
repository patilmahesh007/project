import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      });    await newUser.save();
    
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
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ message: "Invalid credentials" });
    }
    
    const userResponse = { 
      _id: user._id,
      name: user.user, 
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    };
    
    
    const jwtToken = jwt.sign({ userResponse }, process.env.JWT_SECRET, { expiresIn: "24h" });
    
    req.session.token = jwtToken;
 
    
    
    res.json({ success: true, message: "Login successful", userResponse });
  } catch (err) {
    res.json({ message: err.message });
  }
};

export { postSignup, postLogin };
