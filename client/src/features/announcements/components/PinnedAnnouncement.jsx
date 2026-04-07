const PinnedAnnouncement = () => {
  return (
    <div className="bg-[#1e2433] rounded-xl p-4 shadow">
      <h3 className="text-white text-sm font-semibold mb-4">
        Pinned Announcements
      </h3>

      {[1, 2].map((_, i) => (
        <div
          key={i}
          className="mb-4 border-b border-[#2a3142] pb-3 last:border-none"
        >
          <p className="text-gray-300 text-sm font-medium">
            SOP Updates
          </p>
          <p className="text-xs text-gray-400 mt-1">
            We’ve been hard at work behind the scenes refining our SOPs.
          </p>

          <span className="text-xs text-blue-400 cursor-pointer">
            View post
          </span>
        </div>
      ))}
    </div>
  );
};

export default PinnedAnnouncement;
