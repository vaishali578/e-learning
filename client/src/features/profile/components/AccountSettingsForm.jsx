import { useEffect, useState } from "react";
import { updateProfileService } from "../services/profileServices";
import { useUser } from "@/context/UserContext";

const AccountSettingsForm = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
  });

  /* =====================
     Sync context → form
  ===================== */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  /* =====================
     Input handler
  ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* =====================
     Submit handler
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updatedUser = await updateProfileService({
        name: formData.name,
        bio: formData.bio,
      });

      // ✅ sync updated data globally
      setUser(updatedUser);

      alert("Profile updated successfully");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Profile update failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1f2337] rounded-2xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
        Account Settings
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg px-4 py-2 bg-gray-100 dark:bg-[#2a2f4a] 
                       text-gray-800 dark:text-white outline-none focus:ring-2 
                       focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full rounded-lg px-4 py-2 bg-gray-200 dark:bg-[#2a2f4a] 
                       text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Role
          </label>
          <input
            type="text"
            value={formData.role}
            disabled
            className="w-full rounded-lg px-4 py-2 bg-gray-200 dark:bg-[#2a2f4a] 
                       text-gray-500 cursor-not-allowed capitalize"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            className="w-full rounded-lg px-4 py-2 bg-gray-100 dark:bg-[#2a2f4a] 
                       text-gray-800 dark:text-white outline-none focus:ring-2 
                       focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
          aria-label="Save profile changes"
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 
                       text-white transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettingsForm;
