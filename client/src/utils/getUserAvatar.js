/**
 * Get user avatar URL with fallback to default avatar
 * @param {string} avatar - The user's avatar URL
 * @returns {string} - The avatar URL or default avatar
 */
export const getUserAvatar = (avatar) => {
  return avatar || "/default-avatar.svg";
};