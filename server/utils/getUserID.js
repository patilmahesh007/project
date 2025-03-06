const getUserIdFromSession = (req) => {
  try {
    // Check if the cookie exists
    if (!req.cookies || !req.cookies["user-info"]) {
      console.error("No 'user-info' cookie found");
      return null;
    }
    // Parse the cookie value
    const userInfo = JSON.parse(req.cookies["user-info"]);
    // Return the user ID from the nested userResponse
    return userInfo.userResponse && userInfo.userResponse._id ? userInfo.userResponse._id : null;
  } catch (error) {
    console.error("Error parsing 'user-info' cookie:", error);
    return null;
  }
};

export default getUserIdFromSession;
