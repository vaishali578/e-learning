import User from "./auth.model.js";
import { AppError } from "../../utils/appError.js"; 

// Signup service
export const signupUser = async ({ name, email, password, role }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already exists", 400); 
  }

  // Create new user
  const user = await User.create({ name, email, password, role });
  return user;
};

// Login service
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  return user;
};
