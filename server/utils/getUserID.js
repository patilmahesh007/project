const getUserIdFromSession = (req) => {
  try {
    if (!req.cookies || !req.cookies["user-info"]) {
      console.error("No 'user-info' cookie founsdfvsdcsdcv qewdqwddd");
      return null;
    }
    const userInfo = JSON.parse(req.cookies["user-info"]);
    
    return userInfo.userResponse && userInfo.userResponse._id ? userInfo.userResponse._id : null;
  } catch (error) {
    console.error("Error parsing 'user-info' cookie:", error);
    return null;
  }
};

export default getUserIdFromSession;
