import { logger } from '../utils/logger.js';

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (
    err.code === 'P2023' ||
    err.name === 'BSONError' ||
    err.name === 'CastError' ||
    (err.message && (err.message.includes('Malformed object id') || err.message.includes('Inconsistent column data')))
  ) {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  logger.error(`[${statusCode}] ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
};
