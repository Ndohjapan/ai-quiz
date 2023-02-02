const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
  
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .json({ success: err.success, message: err.message });
  }
  return res.status(err.statusCode).json({ message: "Something went wrong" });
};

module.exports = (err, req, res, next) => {
  console.error(err)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};
  