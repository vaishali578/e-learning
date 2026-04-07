import { FiClock, FiVideo, FiMapPin, FiCheckCircle, FiX, FiEdit, FiTrash2, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const getInitials = (str) => {
  if (!str) return "S";
  return str
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const avatarColors = [
  "bg-blue-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-red-500",
  "bg-pink-500",
  "bg-indigo-500",
];

const getAvatarColor = (title) => {
  let sum = 0;
  for (let i = 0; i < title.length; i++) {
    sum += title.charCodeAt(i);
  }
  return avatarColors[sum % avatarColors.length];
};

const ScheduleCard = ({ schedule, isTrainer = false }) => {
  const navigate = useNavigate();
  const startDate = new Date(schedule.startDate);
  const endDate = new Date(schedule.endDate);
  const isUpcoming = startDate > new Date();
  const isCompleted = schedule.status === "completed";
  const isCancelled = schedule.isCancelled;
  const initials = getInitials(schedule.title);
  const avatarColor = getAvatarColor(schedule.title);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  return (
    <div className={`bg-white dark:bg-[#1f2337] rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 flex flex-col ${isCancelled ? "opacity-60" : ""}`}>
      {/* Header with Avatar */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`${avatarColor} text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm flex-shrink-0`}>
            {initials}
          </div>
          {/* Title and Course */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold line-clamp-1 ${isCancelled ? "line-through text-gray-500 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
              {schedule.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              {schedule.course?.title || "Course"}
            </p>
          </div>
        </div>
        {/* Status Indicator */}
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
          isCancelled ? "bg-red-500" : isCompleted ? "bg-emerald-500" : isUpcoming ? "bg-blue-500" : "bg-amber-500"
        }`} />
      </div>

      {/* Date & Time */}
      <div className="flex items-center gap-2 mb-2 text-xs text-gray-600 dark:text-gray-400">
        <FiClock size={12} />
        <span>
          {formatDate(startDate)} • {formatTime(startDate)} - {formatTime(endDate)}
        </span>
      </div>

      {/* Topic */}
      {schedule.topic && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
          {schedule.topic}
        </p>
      )}

      {/* Meeting Link & Location */}
      <div className="flex flex-col gap-1 mb-3 text-xs">
        {schedule.meetingLink && (
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <FiVideo size={12} />
            <a 
              href={schedule.meetingLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="truncate hover:underline"
            >
              Join Meeting
            </a>
          </div>
        )}
        {schedule.location && (
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <FiMapPin size={12} />
            <span className="truncate">{schedule.location}</span>
          </div>
        )}
      </div>

      {/* RSVP Status (for students) */}
      {schedule.studentRsvpStatus && (
        <div className="mb-3 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 dark:bg-blue-500/10">
            <FiCheckCircle size={12} className="text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 capitalize">
              {schedule.studentRsvpStatus === "attending" ? "Attending" : 
               schedule.studentRsvpStatus === "not_attending" ? "Not Attending" : 
               "Maybe Attending"}
            </span>
          </div>
        </div>
      )}

      {/* Cancellation Info */}
      {isCancelled && (
        <div className="mb-3 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-50 dark:bg-red-500/10">
            <FiX size={12} className="text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300">Cancelled</span>
          </div>
          {schedule.cancellationReason && (
            <p className="text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
              {schedule.cancellationReason}
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
        {isTrainer ? (
          <>
            {/* Trainer Actions */}
            {!isCancelled && (
              <>
                <button
                  onClick={() => navigate(`/trainer/schedule/${schedule._id}/edit`)}
                  className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-1"
                >
                  <FiEdit size={12} />
                  Edit
                </button>
                {isUpcoming && (
                  <button
                    onClick={() => navigate(`/trainer/schedule/${schedule._id}/attendance`)}
                    className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-1"
                  >
                    <FiUsers size={12} />
                    RSVPs
                  </button>
                )}
                <button
                  onClick={() => navigate(`/trainer/schedule/${schedule._id}/delete`)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center justify-center"
                >
                  <FiTrash2 size={12} />
                </button>
              </>
            )}
            {!isCancelled && isUpcoming && (
              <button
                onClick={() => navigate(`/trainer/schedule/${schedule._id}/cancel`)}
                className="w-full px-3 py-1.5 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
              >
                Cancel
              </button>
            )}
          </>
        ) : (
          <>
            {/* Student Actions */}
            {!isCancelled && (
              <>
                {schedule.meetingLink && (
                  <a
                    href={schedule.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-500 text-white hover:shadow-md transition-all flex items-center justify-center gap-1"
                  >
                    <FiVideo size={12} />
                    Join
                  </a>
                )}
                {!schedule.meetingLink && (
                  <button
                    onClick={() => navigate(`/student/schedules/${schedule._id}`)}
                    className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Details
                  </button>
                )}
              </>
            )}
            {isCompleted && (
              <button className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1">
                <FiCheckCircle size={12} />
                Completed
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ScheduleCard;
