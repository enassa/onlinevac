export function sendSuccess(response, data, message = 'Success', statusCode = 200) {
  return response.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendCreated(response, data, message = 'Created') {
  return sendSuccess(response, data, message, 201);
}
