const errorHandler = (err, req, res, next) => {
  console.error('Error Details:', err);

  let statusCode = 500;
  let message = 'Something went wrong on our end. Please try again later.';
  let errors = [];

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = 'This record already exists. Duplicate value found.';
    const field = Object.keys(err.keyValue)[0];
    errors = [{ field, message: `${field} must be unique.` }];
  }

  // Zod validation error (if caught outside validate middleware)
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Data provided is invalid.';
    errors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Your session is invalid. Please log in again.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  }

  // Custom App Errors
  if (err.status) {
    statusCode = err.status;
    message = err.message;
  } else if (err.message && statusCode === 500) {
    // If it's a known error message but status not set
    message = err.message;
    statusCode = 400; // Assume bad request unless it's a true 500
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
