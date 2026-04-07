import { FiCalendar, FiDollarSign, FiEdit, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProgressBar from "@/components/common/ProgressBar";
import { getCourseProgress } from "@/features/progress/services/progressService";

const CourseCard = ({ course, role = "student" }) => {
  const navigate = useNavigate();

  const [progressPercentage, setProgressPercentage] = useState(0);

  const status = course?.status || "draft";
  const isDraft = status === "draft";
  const isTrainer = role === "trainer";
  const isStudent = role === "student";

  const isEnrolled =
    course?.isEnrolled === true || course?.isPurchased === true;

  /* ===============================
     FETCH PROGRESS (FOR ENROLLED STUDENT)
  ================================= */
  useEffect(() => {
    const fetchProgress = async () => {
      if (isStudent && isEnrolled && course?._id) {
        try {
          const response = await getCourseProgress(course._id);
          setProgressPercentage(
            response?.data?.progressPercentage || 0
          );
        } catch (error) {
          console.error("Progress fetch error:", error);
        }
      }
    };

    fetchProgress();
  }, [course?._id, isStudent, isEnrolled]);

  // ===== DEFAULT BUTTON =====
  let buttonLabel = "Buy Now";
  let buttonAction = () =>
    navigate(`/student/checkout/${course._id}`);
  let buttonGradient = "from-emerald-500 to-emerald-700";
  let buttonIcon = <FiArrowRight size={14} />;

  // ===== TRAINER FLOW =====
  if (isTrainer) {
    buttonLabel = isDraft
      ? "Continue Editing"
      : "View Course";

    buttonAction = () =>
      navigate(`/trainer/courses/${course._id}/builder`);

    buttonGradient = "from-blue-500 to-blue-700";
    buttonIcon = isDraft ? <FiEdit size={14} /> : <FiArrowRight size={14} />;
  }

  // ===== STUDENT FLOW =====
  if (isStudent) {
    if (isEnrolled) {
      buttonLabel = "Go to Course";
      buttonAction = () =>
        navigate(`/student/courses/${course._id}`);
      buttonGradient = "from-blue-500 to-blue-700";
      buttonIcon = <FiArrowRight size={14} />;
    } else {
      buttonLabel = "Enroll Now";
      buttonAction = () =>
        navigate(`/student/checkout/${course._id}`);
      buttonGradient = "from-emerald-500 to-emerald-700";
      buttonIcon = <FiArrowRight size={14} />;
    }
  }

  const disableButton = isStudent && isDraft;

  return (
    <div className="bg-white dark:bg-[#1f2337] rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group flex flex-col h-full">
      
      {/* Thumbnail */}
      <div className="relative mb-0 overflow-hidden h-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        <img
          src={
            course?.thumbnail
              ? `http://localhost:4000${course.thumbnail}`
              : "/placeholder-course.jpg"
          }
          alt={course?.title || "Course"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <span
          className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full text-white backdrop-blur-sm ${
            isDraft ? "bg-amber-500/90" : "bg-emerald-500/90"
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
          {course?.title || "Untitled Course"}
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-grow">
          {course?.description || "No description"}
        </p>

        {/* Progress bar */}
        {isStudent && isEnrolled && (
          <div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Progress
              </span>
              <span className={`text-xs font-bold ${progressPercentage >= 75 ? "text-emerald-600 dark:text-emerald-400" : progressPercentage >= 50 ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"}`}>
                {progressPercentage}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${progressPercentage >= 75 ? "bg-emerald-500" : progressPercentage >= 50 ? "bg-blue-500" : "bg-amber-400"}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3 py-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <FiCalendar size={13} />
            <span>
              {course?.createdAt
                ? new Date(course.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                : "—"}
            </span>
          </div>

          <div className="flex items-center gap-1 font-semibold">
            <FiDollarSign size={13} />
            <span>
              {course?.price === 0
                ? "Free"
                : `₹${course?.price}`}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          aria-label={disableButton ? "Unavailable" : buttonLabel}
          onClick={buttonAction}
          disabled={disableButton}
          className={`mt-auto w-full text-xs font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            disableButton
              ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              : `bg-gradient-to-br ${buttonGradient} text-white hover:shadow-md hover:scale-105`
          }`}
        >
          {disableButton ? "Unavailable" : buttonLabel}
          {!disableButton && buttonIcon}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;