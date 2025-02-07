import jwt from "jsonwebtoken";

const getUserIdFromSession = (req) => {
  if (!req.session || !req.session.token) return null;
  try {
    const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
    return decoded.userResponse._id;
  } catch (error) {
    console.error("Error verifying session token:", error);
    return null;
  }
};

export default getUserIdFromSession;
