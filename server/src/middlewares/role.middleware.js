import { AppError } from "../utils/appError.js";

export const allowedRoles = (...roles) => {
  return (req, res, next) => {
    
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to access this resource", 403),
      );
    }
    next();
  };
};
