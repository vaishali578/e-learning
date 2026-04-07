import AnnouncementHeader from "../components/AnnouncementHeader";
import AnnouncementCard from "../components/AnnouncementCard";
import PinnedAnnouncement from "../components/PinnedAnnouncement";

const AnnouncementsPage = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Section */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <AnnouncementHeader />
        <AnnouncementCard />
        <AnnouncementCard pinned />
      </div>

      {/* Right Section */}
      <div className="col-span-12 lg:col-span-4">
        <PinnedAnnouncement />
      </div>
    </div>
  );
};

export default AnnouncementsPage;
