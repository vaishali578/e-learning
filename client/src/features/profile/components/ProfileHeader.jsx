import { useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { useUser } from "@/context/UserContext";
import { uploadProfilePhotoService } from "../services/profileServices";
import { getUserAvatar } from "@/utils/getUserAvatar";

const ProfileHeader = () => {
  const { user: profile, loading } = useUser();

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  if (loading || !profile) return null;

  const hasProfilePhoto =
    profile.profilePhoto && profile.profilePhoto.trim() !== "";

  const avatarSrc = selectedImage
    ? URL.createObjectURL(selectedImage)
    : hasProfilePhoto
      ? profile.profilePhoto
      : getUserAvatar(null);

  // 📸 Open file picker
  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  // 📂 Store selected file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // 💾 Upload API Call (logic not written here)
  const handleSaveImage = async () => {
    if (!selectedImage) return;

    try {
      const response = await uploadProfilePhotoService(selectedImage);

      console.log("Image ready for upload:", selectedImage);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1f2337] rounded-xl p-5 shadow">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <img
              src={avatarSrc}
              className="w-24 h-24 rounded-full object-cover"
              alt="Profile"
              onError={(e) => {
                e.target.src = "/default-avatar.svg";
              }}
            />

            {/* Camera Button */}
            <button
              aria-label="Change profile photo"
              onClick={handleCameraClick}
              className="absolute top-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"
            >
              <FiCamera size={14} />
            </button>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {profile.name}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile.bio || "No bio added"}
            </p>

            <div className="flex gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400">
                {profile.role}
              </span>

              <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-600 dark:bg-green-600/20 dark:text-green-400">
                Active
              </span>
            </div>

            {/* Save Button (Only show if new image selected) */}
            {selectedImage && (
              <button
              aria-label="Save new profile photo"
                onClick={handleSaveImage}
                className="mt-3 px-4 py-1 text-sm bg-green-700 text-white rounded-md cursor-pointer hover:bg-green-800"
              >
                Save Image
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
