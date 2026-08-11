import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

import BadRequestError from './bad-request.js';
import UnauthenticatedError from './unauthenticated.js';

export {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
};