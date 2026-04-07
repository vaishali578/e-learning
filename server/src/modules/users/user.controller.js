import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import { getUsersService, updateUserProfile , getMyProfileService ,updateBasicInfoService, updatePasswordService, updateSocialLinksService} from "./user.service.js";

// All users or filtered by role
export const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const currentUserId = req.user.id;

  const users = await getUsersService(role, currentUserId);

  res.status(200).json({
    success: true,
    data: users,
  });
});

// ✅ Update profile controller (asyncHandler version)
export const updateProfileController = asyncHandler(async (req, res) => {
  // 1️⃣ Logged-in user id
  const userId = req.user.id;

  // 2️⃣ Update data from frontend
  const updateData = req.body;

  // 3️⃣ Call service
  const updatedUser = await updateUserProfile(userId, updateData);

  // 4️⃣ Response
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

export const getMyProfileController = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await getMyProfileService(userId);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateBasicInfoController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { phone, dob } = req.body;

  // 🚫 Empty body protection
  if (!phone && !dob) {
    throw new AppError("Provide phone or date of birth", 400);
  }

  const updatedUser = await updateBasicInfoService(userId, { phone, dob });

  res.status(200).json({
    success: true,
    message: "Basic information updated",
    data: {
      phone: updatedUser.phone,
      dob: updatedUser.dob,
    },
  });
});

export const updatePasswordController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // 🔴 Basic validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new AppError("All password fields are required", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new AppError("New password and confirm password do not match", 400);
  }

  await updatePasswordService(userId, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// 🔗 Update Social Links
export const updateSocialLinksController = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const updatedUser = await updateSocialLinksService(userId, req.body);

  res.status(200).json({
    success: true,
    message: "Social links updated successfully",
    data: updatedUser,
  });
});