import { signupUser, loginUser } from "./auth.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import jwt from "jsonwebtoken";

// Helper to generate JWT token
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// Signup
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const allowedRoles = ["student", "trainer"];
  if (!allowedRoles.includes(role)) {
    throw new AppError(`Role must be either student or trainer`, 400);
  }

  const user = await signupUser({ name, email, password, role});

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    },
  });
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    },
  });
});
