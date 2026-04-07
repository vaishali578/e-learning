import ReactionBar from "./ReactionBar";
import TagBadge from "./TagBadge";

const AnnouncementCard = ({ pinned }) => {
  return (
    <div className="bg-[#1e2433] rounded-xl p-5 shadow">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <img
            src="https://i.pravatar.cc/40"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="text-white text-sm font-semibold">
              Mufli Hidayat
            </h3>
            <p className="text-xs text-gray-400">
              Project Manager · Mar 16, 09:00 PM
            </p>
          </div>
        </div>

        {pinned && (
          <span className="text-xs text-yellow-400 font-medium">Pinned</span>
        )}
      </div>

      <div className="mt-4">
        <TagBadge label="General" />

        <h2 className="text-white mt-3 font-semibold">
          Welcome to Timi People 🎉
        </h2>

        <p className="text-gray-300 text-sm mt-2 leading-relaxed">
          We’re thrilled to share exciting updates with you! Our team
          has been working hard and we’re delighted to introduce the
          latest features that will enhance your experience.
        </p>
      </div>

      <ReactionBar />
    </div>
  );
};

export default AnnouncementCard;
