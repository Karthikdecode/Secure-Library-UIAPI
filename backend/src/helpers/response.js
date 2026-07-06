// TODO: Add standardized success/error response helpers.
export const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

export const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ message });
};
