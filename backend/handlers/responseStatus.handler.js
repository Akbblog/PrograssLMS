const responseStatus = (res, statusCode, status, data, message) => {
  // New unified format: { success: boolean, data: any, message: string }
  if (status === "success") {
    return res.status(statusCode).json({
      success: true,
      data: data !== undefined ? data : null,
      message: message || "Operation successful",
    });
  } else {
    return res.status(statusCode).json({
      success: false,
      data: null,
      message: message || data || "Operation failed",
    });
  }
};
module.exports = responseStatus;
