import User from "../model/user.model.js";
import responder from "../utils/responder.js";
import getUserIdFromToken from "../utils/getUserID.js";

export const uploadProfilePhotoController = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return responder(res, null, "Unauthorized: No token provided", false, 401);
    }
    if (!req.file) {
      return responder(res, null, "No file uploaded", false, 400);
    }
    const profilePhotoUrl = req.file.path;
    await User.findByIdAndUpdate(userId, { profilePhoto: profilePhotoUrl });
    return responder(
      res,
      { profilePhoto: profilePhotoUrl },
      "Profile photo updated successfully",
      true,
      200
    );
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return responder(res, null, error.message, false, 500);
  }
};
