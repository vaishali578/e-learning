import { useEffect, useState } from "react";
import ProgressBar from "@/components/common/ProgressBar";
import { FiBook, FiFileText, FiCheckCircle } from "react-icons/fi";

const CourseProgressWidget = ({ courseId }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be called whenever the course changes
    // In a real app, you'd fetch from the progress service
    // For now, we'll initialize with default values
    setProgress({
      overall: 0,
      lessons: 0,
      quizzes: 0,
      completedLessons: 0,
      totalLessons: 0,
      passedQuizzes: 0,
      totalQuizzes: 0,
    });
    setLoading(false);
  }, [courseId]);

  if (loading) return null;
  if (!progress) return null;

  return (
    <div className="bg-white dark:bg-[#1f2337] rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          Course Progress
        </h3>
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {progress.overall}%
        </span>
      </div>

      <ProgressBar percentage={progress.overall} size="md" showLabel={false} />

      <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <FiBook size={16} />
          <span>{progress.completedLessons}/{progress.totalLessons}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <FiFileText size={16} />
          <span>{progress.passedQuizzes}/{progress.totalQuizzes}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <FiCheckCircle size={16} />
          <span>{Math.round(progress.overall)}% Done</span>
        </div>
      </div>
    </div>
  );
};

export default CourseProgressWidget;
