import { useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import BasicInfoCard from "../components/BasicInfoCard";
import SocialLinksCard from "../components/SocialLinksCard";
import AccountSettingsForm from "../components/AccountSettingsForm";
import UpdatePasswordCard from "../components/UpdatePasswordCard";
import DangerZone from "../components/DangerZone";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          <BasicInfoCard />
          <SocialLinksCard />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 bg-[#1f2337] px-6 py-9 rounded-xl w-full">
            {["profile", "security", "danger"].map((tab) => (
              <button
              aria-label={`Switch to ${tab} tab`}
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2 rounded-lg text-sm font-medium transition
                  ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
              >
                {tab === "profile" && "Profile"}
                {tab === "security" && "Security"}
                {tab === "danger" && "Danger"}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            {activeTab === "profile" && <AccountSettingsForm />}
            {activeTab === "security" && <UpdatePasswordCard />}
            {activeTab === "danger" && <DangerZone />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
