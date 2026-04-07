import { useState } from "react";
import { updatePasswordService } from "../services/profileServices";

const UpdatePasswordCard = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await updatePasswordService({
        currentPassword,
        newPassword,
      });

      alert("Password updated successfully");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1f2337] rounded-2xl shadow p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
        Update Password
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Current Password */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            className="w-full rounded-lg px-4 py-2 bg-gray-100 dark:bg-[#2a2f4a] 
                       text-gray-800 dark:text-white outline-none focus:ring-2 
                       focus:ring-blue-500"
            required
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full rounded-lg px-4 py-2 bg-gray-100 dark:bg-[#2a2f4a] 
                       text-gray-800 dark:text-white outline-none focus:ring-2 
                       focus:ring-blue-500"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter new password"
            className="w-full rounded-lg px-4 py-2 bg-gray-100 dark:bg-[#2a2f4a] 
                       text-gray-800 dark:text-white outline-none focus:ring-2 
                       focus:ring-blue-500"
            required
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
          aria-label="Update password"
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 
                       text-white transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePasswordCard;
