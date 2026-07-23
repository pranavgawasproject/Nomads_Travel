const errorHandler = (err, req, res, _next) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const stack = process.env.NODE_ENV === "production" ? undefined : err.stack;

  return res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(stack && { stack })
  });
};

export default errorHandler;

