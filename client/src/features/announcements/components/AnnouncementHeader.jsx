import { Image, Video, Calendar } from "lucide-react";

const AnnouncementHeader = () => {
  return (
    <div className="bg-[#1e2433] rounded-xl p-4 shadow">
      <input
        type="text"
        placeholder="Create Announcement"
        className="w-full bg-[#2a3142] text-sm text-white px-4 py-3 rounded-lg focus:outline-none"
      />

      <div className="flex items-center gap-6 mt-3 text-sm text-gray-400">
        <div className="flex items-center gap-2 cursor-pointer hover:text-white">
          <Image size={18} /> Photo
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-white">
          <Video size={18} /> Video
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-white">
          <Calendar size={18} /> Event
        </div>
      </div>
    </div>
  );
};

export default AnnouncementHeader;
