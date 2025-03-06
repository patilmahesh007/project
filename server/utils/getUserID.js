const getUserIdFromSession = (req) => {
  try {
    // Ensure the "user-info" cookie exists
    if (!req.cookies || !req.cookies["user-info"]) return null;
    
    // Parse the JSON string stored in the cookie
    const userInfo = JSON.parse(req.cookies["user-info"]);
    
    // Return the _id field from the parsed object
    return userInfo._id;
  } catch (error) {
    console.error("Error reading user-info cookie:", error);
    return null;
  }
};

export default getUserIdFromSession;
