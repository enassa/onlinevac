export function errorHandler(error, request, response, next) {
  const statusCode = error.statusCode || 500;
  const payload = {
    success: false,
    message: error.message || 'Internal server error',
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = error.stack;
  }

  return response.status(statusCode).json(payload);
}
