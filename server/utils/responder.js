const responder = (res, data, message = "Success", success = true, statusCode = 200) => {
    return res.status(statusCode).json({
      success,
      message: message || "Success",
      data: data || null,
    });
  };
  
  export default responder;
  