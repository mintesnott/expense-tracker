import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import UnauthenticatedError  from '../errors/unauthenticated.js';

export const protect = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    const user = await User.findById(payload.id).select('-password');

      if (!user) {
        throw new UnauthenticatedError('Authentication invalid');
      }

      if (payload.tokenVersion !== user.tokenVersion) {
        throw new UnauthenticatedError(
          'Your session has expired. Please log in again.'
        );
      }

    req.user = user;
    next();
 } catch (error) {
      if (error instanceof UnauthenticatedError) {
        throw error;
      }
      throw new UnauthenticatedError('Authentication invalid');
    }
};

 
