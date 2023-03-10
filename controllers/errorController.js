const AppError = require('../utils/appError');

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid Token, Please login again!', 404);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired, Please log in again!');

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  //? Errors using API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error(err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }

  //? Errors using UI
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  console.error(err);
  return res.status(500).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production ') {
    let customError = Object.create(err);

    if (customError.name === 'CastError') {
      customError = handleCastErrorDB(customError);
    }
    if (customError.code === 11000) {
      customError = handleDuplicateFieldsDB(customError);
    }
    if (customError.name === 'ValidationError') {
      customError = handleValidationErrorDB(customError);
    }
    if (customError.name === 'JsonWebTokenError') {
      customError = handleJWTError();
    }
    if (customError.name === 'TokenExpiredError') {
      customError = handleJWTExpiredError();
    }
    sendErrorProd(customError, req, res);
  }
};
