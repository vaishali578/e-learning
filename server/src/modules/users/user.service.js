import User from "../auth/auth.model.js";
import { AppError } from "../../utils/appError.js";
import bcrypt from "bcryptjs";

// Get all users or filter by role
export const getUsersService = async (role, currentUserId) => {
  // 👇 filter by role if provided
  const filter = role ? { role } : {};

  const users = await User.find(filter)
    .select("-password")
    .lean();

  // 👇 remove current user
  return users.filter(
    (user) => user._id.toString() !== currentUserId 
  );
};

// Update profile service
export const updateUserProfile = async (userId, updateData) => {
  // 1️⃣ Validate userId
  if (!userId) {
    throw new AppError("User id is required", 400);
  }

  // 2️⃣ Allow ONLY name and bio
  const allowedFields = ["name", "bio"];

  // 3️⃣ Filter allowed fields only
  const filteredData = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  // 4️⃣ If nothing valid to update
  if (Object.keys(filteredData).length === 0) {
    throw new AppError("Only name and bio can be updated", 400);
  }

  // 5️⃣ Extra validation
  if (filteredData.name && filteredData.name.trim().length < 2) {
    throw new AppError("Name must be at least 2 characters", 400);
  }

  if (filteredData.bio && filteredData.bio.length > 300) {
    throw new AppError("Bio cannot exceed 300 characters", 400);
  }

  // 6️⃣ Update user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: filteredData },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  // 7️⃣ If user not found
  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  return updatedUser;
};


export const getMyProfileService = async (userId) => {
  if (!userId) {
    throw new AppError("User id is required", 400);
  }

  const user = await User.findById(userId)
    .select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const updateBasicInfoService = async (userId, data) => {
  const updateData = {};

  if (data.phone) {
    updateData.phone = data.phone;
  }

  if (data.dob) {
    const dobDate = new Date(data.dob);

    if (isNaN(dobDate.getTime())) {
      throw new AppError("Invalid date of birth", 400);
    }

    if (dobDate > new Date()) {
      throw new AppError("Date of birth cannot be in future", 400);
    }

    updateData.dob = dobDate;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const updatePasswordService = async (
  userId,
  currentPassword,
  newPassword
) => {
  // 🔹 Get user with password
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // 🔐 Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 401);
  }

  // 🚫 Prevent same password
  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) {
    throw new AppError("New password must be different", 400);
  }

  // 🔑 Update password (pre-save hook will hash it)
  user.password = newPassword;
  await user.save();
};

export const updateSocialLinksService = async (userId, data) => {
  if (!userId) {
    throw new AppError("User id is required", 400);
  }

  // ✅ Allowed social fields only
  const allowedFields = ["linkedin", "github", "twitter"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined && data[field].trim() !== "") {
      updates[field] = data[field].trim();
    }
  });

  // ❌ Nothing valid provided
  if (Object.keys(updates).length === 0) {
    throw new AppError("No valid social links provided", 400);
  }

  // 🚀 Update user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  return updatedUser;
};

