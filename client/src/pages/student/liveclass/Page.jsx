import { FiClock, FiVideo, FiUser } from "react-icons/fi";

const LiveClasses = () => {
  const liveClasses = [
    {
      id: 1,
      title: "React Hooks Deep Dive",
      trainer: "Vaishali",
      time: "10:00 AM - 11:30 AM",
      status: "Live",
    },
    {
      id: 2,
      title: "Node.js Authentication",
      trainer: "Robert",
      time: "02:00 PM - 03:00 PM",
      status: "Upcoming",
    },
    {
      id: 3,
      title: "MongoDB Aggregations",
      trainer: "John Doe",
      time: "05:00 PM - 06:00 PM",
      status: "Upcoming",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Live Classes
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Join scheduled live sessions and interact with trainers
        </p>
      </div>

      {/* Live Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white dark:bg-[#1f2337]
            rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            {/* Top */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiVideo className="text-blue-500 dark:text-blue-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Live Class
                </span>
              </div>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                  ${
                    cls.status === "Live"
                      ? "bg-red-500 text-white"
                      : "bg-blue-100 text-blue-500 dark:bg-blue-900/40 dark:text-blue-400"
                  }`}
              >
                {cls.status}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
              {cls.title}
            </h3>

            {/* Meta */}
            <div className="mt-3 space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FiUser />
                <span>{cls.trainer}</span>
              </div>

              <div className="flex items-center gap-2">
                <FiClock />
                <span>{cls.time}</span>
              </div>
            </div>

            {/* Action */}
            <button
              aria-label={cls.status === "Live" ? `Join ${cls.title}` : `View details of ${cls.title}`}
              className={`mt-4 w-full text-xs font-medium py-2 rounded-lg transition
                ${
                  cls.status === "Live"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white"
                }`}
            >
              {cls.status === "Live" ? "Join Now" : "View Details"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveClasses;
