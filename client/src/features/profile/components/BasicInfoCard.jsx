import { useState, useEffect } from "react";
import { FiEdit2, FiCheck } from "react-icons/fi";
import { updateBasicInfoService } from "../services/profileServices";
import { useUser } from "@/context/UserContext";

const InfoRow = ({ label, children }) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    {children}
  </div>
);

const EditableRow = ({ value, setValue, placeholder, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    await onSave();
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-1.5 rounded-md text-sm
                       bg-gray-100 dark:bg-[#2a2f4a]
                       text-gray-900 dark:text-white
                       outline-none"
          />
          <button
              aria-label="Save changes"
            onClick={handleSave}
            className="text-green-500 hover:text-green-600"
          >
            <FiCheck />
          </button>
        </>
      ) : (
        <>
          <p className="font-semibold text-gray-900 dark:text-white">
            {value || (
              <span className="text-gray-400 italic">
                Not added yet
              </span>
            )}
          </p>
          <button
              aria-label="Edit information"
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-500"
          >
            <FiEdit2 />
          </button>
        </>
      )}
    </div>
  );
};

const BasicInfoCard = () => {
  const { user, setUser } = useUser();

  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  // sync local state from global user
  useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
      setDob(user.dob || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const updatedUser = await updateBasicInfoService({
        phone,
        dob,
      });

      // ✅ global sync
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update basic info", error);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1f2337] rounded-xl shadow p-5">
      <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
        Basic Information
      </h4>

      <div className="space-y-4">
        <InfoRow label="Full Name">
          <p className="font-semibold text-gray-900 dark:text-white">
            {user?.name || "Emma Smith"}
          </p>
        </InfoRow>

        <InfoRow label="Email">
          <p className="font-semibold text-gray-900 dark:text-white">
            {user?.email || "emma.smith@gmail.com"}
          </p>
        </InfoRow>

        <InfoRow label="Phone">
          <EditableRow
            value={phone}
            setValue={setPhone}
            placeholder="Enter phone number"
            onSave={handleSave}
          />
        </InfoRow>

        <InfoRow label="Date of Birth">
          <EditableRow
            value={dob}
            setValue={setDob}
            placeholder="DD/MM/YYYY"
            onSave={handleSave}
          />
        </InfoRow>
      </div>
    </div>
  );
};

export default BasicInfoCard;
