const { NODE_ENV } = require('../config/env');

module.exports = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'A record with this value already exists.';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found.';
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
