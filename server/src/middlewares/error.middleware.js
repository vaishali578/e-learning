export const errorHandler = (err, req, res, next) => {
  // default values
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // dev environment
  if (process.env.NODE_ENV === "development") {
    console.log("🔥 ERROR STACK TRACE");
    console.log(err.stack);

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }

  // production environment
  res.status(err.statusCode).json({
    success: false,
    message: err.isOperational
      ? err.message
      : "Something went wrong, please try again later",
  });
};
