import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  };

  // Mongoose Validation Error (e.g., missing required fields)
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Mongoose Duplicate Key Error (e.g., email already exists)
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = Object.values(err.keyValue)[0];

    customError.msg = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' is already registered. Please use another ${field}.`;
    customError.statusCode = StatusCodes.CONFLICT;
  }

  // Mongoose Cast Error (e.g., invalid ObjectId format in URL)
  if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  // Invalid JWT Token
  if (err.name === 'JsonWebTokenError') {
    customError.msg = 'Authentication invalid. Token is malformed.';
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }

  // Expired JWT Token
  if (err.name === 'TokenExpiredError') {
    customError.msg = 'Authentication expired. Please log in again.';
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }

  // Malformed JSON Payload
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    customError.msg = 'Invalid JSON payload received.';
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;

/*import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  // Set default values for generic errors
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  };

  // Mongoose validation error (e.g., missing required fields)
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Mongoose duplicate key error (e.g., email already exists)
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = Object.values(err.keyValue)[0];
    
    customError.msg = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' is already registered. Please use another ${field}.`;
    customError.statusCode = StatusCodes.CONFLICT; // 409
  }

  // Mongoose cast error (e.g., invalid ObjectId format in URL)
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;

*/