function notFound(req, res) {
  res.status(404).json({ success: false, message: "Route not found" });
}

function errorHandler(error, req, res, _next) {
  console.error(error);

  if (error && error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors,
    });
  }

  if (error && error.code === 11000) {
    return res
      .status(409)
      .json({ success: false, message: "Email is already registered" });
  }

  const status = error.statusCode || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : error.message,
  });
}

module.exports = { notFound, errorHandler };
