import jwt from "jsonwebtoken";
const verify = (req, res, next) => {
  if (!req.session || !req.session.token) {
    return res.status(401).json({ message: "Unauthorized: No session found" });
  }

  try {
    const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export default verify;
