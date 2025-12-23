export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};


export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
};