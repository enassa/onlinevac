import mongoose from 'mongoose';
import { createHttpError } from '../utils/createHttpError.js';

export function validateObjectId(paramName) {
  return (request, response, next) => {
    const value = request.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(value)) {
      next(createHttpError(400, `Invalid ${paramName}`));
      return;
    }
    next();
  };
}
