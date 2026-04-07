import { FiClock, FiCheckCircle, FiBarChart2, FiPlay } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const getInitials = (str) => {
  if (!str) return "Q";
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

const QuizCard = ({
  id,
  title,
  category,
  time,
  questions,
  completed,
  score = 0,
  passMarks = 0,
  totalMarks = 0,
}) => {
  const navigate = useNavigate();

  const isPassed = score >= passMarks;
  const percentage =
    totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
  const initials = getInitials(title);
  const avatarColor = getAvatarColor(title);

  return (
    <div className="bg-white dark:bg-[#1f2337] rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Header with Avatar and Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`${avatarColor} text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm flex-shrink-0`}>
            {initials}
          </div>
          {/* Title and Category */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
              {title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              {category}
            </p>
          </div>
        </div>
        {/* Status Dot */}
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${completed ? (isPassed ? "bg-emerald-500" : "bg-red-500") : "bg-amber-500"}`} />
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-between mb-2.5 text-xs">
        <span className="text-gray-600 dark:text-gray-400 font-medium">Score:</span>
        <span className={`font-bold ${completed ? (isPassed ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400") : "text-gray-600 dark:text-gray-400"}`}>
          {completed ? `${score}/${totalMarks}` : "—"}
        </span>
      </div>

      {/* Time and Questions */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 space-y-1">
        <div>Time: {time ? `${time} min` : "N/A"}</div>
        <div>Questions: {questions || totalMarks}</div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-auto">
        {completed ? (
          <>
            <button
              aria-label="View Results"
              className="w-full px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
            >
              <FiCheckCircle size={13} />
              Review
            </button>
          </>
        ) : (
          <button
            aria-label={`Start quiz ${title}`}
            onClick={() => navigate(`/student/courses/quiz/${id}`)}
            className="w-full px-3 py-1.5 rounded-md text-xs font-medium bg-blue-500 text-white hover:shadow-md transition-all flex items-center justify-center gap-1"
          >
            <FiPlay size={13} />
            Start
          </button>
        )}
        <button
          aria-label="View Statistics"
          className="px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
        >
          <FiBarChart2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
