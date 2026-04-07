import { FiCheckCircle, FiCalendar, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const EnrolledCourseCard = ({ course }) => {
  const navigate = useNavigate();

  const progressPercent = course?.progressPercentage || 0;
  const isCompleted = progressPercent === 100;

  return (
    <div className="bg-white dark:bg-[#1f2337] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group flex flex-col h-full">
      {/* Thumbnail Container */}
      <div className="relative overflow-hidden h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        <img
          src={`http://localhost:4000${course.thumbnail}` || "/placeholder-course.jpg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Level Badge - Top Right */}
        <span className="absolute top-2 right-2 bg-blue-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {course.level || "Beginner"}
        </span>

        {/* Completion Badge - Top Left */}
        {isCompleted && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
            <FiCheckCircle size={11} />
            Done
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 text-sm leading-tight">
          {course.title}
        </h3>

        {/* Progress Section */}
        {!isCompleted && (
          <div className="mb-2.5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Progress</span>
              <span className={`text-xs font-bold ${progressPercent >= 75 ? "text-emerald-600 dark:text-emerald-400" : progressPercent >= 50 ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"}`}>
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${progressPercent >= 75 ? "bg-emerald-500" : progressPercent >= 50 ? "bg-blue-500" : "bg-amber-400"}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Course Meta - Date */}
        <div className="flex items-center gap-1 mb-3 text-xs text-gray-500 dark:text-gray-400">
          <FiCalendar size={12} />
          <span>
            {course.createdAt
              ? new Date(course.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              : "—"}
          </span>
        </div>

        {/* Action Button */}
        <button
          aria-label={isCompleted ? "Review Course" : "Continue Learning"}
          onClick={() => navigate(`/student/courses/${course._id}`)}
          className={`w-full py-2 rounded-md text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 mt-auto ${
            isCompleted
              ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-150 dark:hover:bg-gray-750"
              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-md"
          }`}
        >
          {isCompleted ? "Review" : "Continue"}
          <FiArrowRight size={12} className="transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;
