import { FiDownload, FiBarChart2 } from "react-icons/fi";

const getInitials = (text) => {
  return text
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (text) => {
  const colors = [
    "bg-blue-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-slate-600",
    "bg-indigo-600",
    "bg-teal-600",
  ];
  const index = text.charCodeAt(0) % colors.length;
  return colors[index];
};

const AssignmentCard = ({ assignment }) => {
  const initials = getInitials(assignment.courseName);
  const avatarColor = getAvatarColor(assignment.courseName);
  const isSubmitted = assignment.completed;
  const statusColor = isSubmitted ? "bg-green-600" : "bg-red-600";

  return (
    <div className="bg-white dark:bg-[#1f2337] rounded-lg p-5 shadow-sm hover:shadow-md transition border border-gray-100 dark:border-gray-700">
      {/* Header with Avatar and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`${avatarColor} w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {assignment.courseName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {assignment.sectionName}
            </p>
          </div>
        </div>
        <div className={`${statusColor} w-3 h-3 rounded-full flex-shrink-0 mt-1`} />
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {assignment.title}
      </p>

      {/* Completion Percentage */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {assignment.progress}%
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Completion</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all ${
            assignment.progress >= 75
              ? "bg-emerald-500"
              : assignment.progress >= 50
              ? "bg-blue-500"
              : "bg-amber-400"
          }`}
          style={{ width: `${assignment.progress}%` }}
        />
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-xs mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Marks</span>
          <span className="font-semibold text-gray-900 dark:text-white">{assignment.marks}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Due Date</span>
          <span className="font-semibold text-gray-900 dark:text-white">{assignment.dueDate || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Assigned</span>
          <span className="font-semibold text-gray-900 dark:text-white">{assignment.date}</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {assignment.badge?.text || "Pending"}
        </p>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button className="flex-1 flex items-center justify-center gap-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-gray-800 p-2 rounded transition text-xs font-semibold">
          <FiDownload size={14} />
          Download
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 p-2 rounded transition text-xs font-semibold">
          <FiBarChart2 size={14} />
          Details
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;
