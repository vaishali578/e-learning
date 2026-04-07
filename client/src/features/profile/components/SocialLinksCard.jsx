import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { updateSocialLinksService } from "../services/profileServices";
import { useUser } from "@/context/UserContext";

const SocialLinksCard = () => {
  const { user, setUser } = useUser();

  const [socials, setSocials] = useState({
    linkedin: "",
    github: "",
    twitter: "",
  });

  const [loading, setLoading] = useState(false);

  /* =====================
     Sync from global user
  ===================== */
  useEffect(() => {
    if (user?.socialLinks) {
      setSocials({
        linkedin: user.socialLinks.linkedin || "",
        github: user.socialLinks.github || "",
        twitter: user.socialLinks.twitter || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const updatedUser = await updateSocialLinksService(socials);

      // ✅ update global user
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update social links", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1f2337] rounded-2xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
        Social Profiles
      </h2>

      <div className="space-y-4">
        {/* LinkedIn */}
        <div className="flex items-center gap-3">
          <FaLinkedin className="text-blue-600 text-xl" />
          <input
            type="text"
            name="linkedin"
            value={socials.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn profile URL"
            className="flex-1 rounded-lg px-4 py-2 bg-gray-100 dark:bg-[#2a2f4a] 
                       text-gray-800 dark:text-white outline-none"
          />
        </div>

        {/* GitHub */}
        <div className="flex items-center gap-3">
          <FaGithub className="text-gray-800 dark:text-white text-xl" />
          <input
            type="text"
            name="github"
            value={socials.github}
            onChange={handleChange}
            placeholder="GitHub profile URL"
            className="flex-1 rounded-lg px-4 py-2 bg-gray-100 dark:bg-[#2a2f4a] 
                       text-gray-800 dark:text-white outline-none"
          />
        </div>

        {/* Twitter */}
        <div className="flex items-center gap-3">
          <FaTwitter className="text-sky-500 text-xl" />
          <input
            type="text"
            name="twitter"
            value={socials.twitter}
            onChange={handleChange}
            placeholder="Twitter profile URL"
            className="flex-1 rounded-lg px-4 py-2 bg-gray-100 dark:bg-[#2a2f4a] 
                       text-gray-800 dark:text-white outline-none"
          />
        </div>

        <button
        aria-label="Update social links"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 
                     text-white transition disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Social Links"}
        </button>
      </div>
    </div>
  );
};

export default SocialLinksCard;
