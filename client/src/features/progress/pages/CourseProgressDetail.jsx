import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useParams } from "react-router-dom";
import { getCourseProgress } from "@/features/progress/services/progressService";
import ProgressBar from "@/components/common/ProgressBar";
import { FiBook, FiCheckCircle, FiClock, FiFileText } from "react-icons/fi";

const CourseProgressDetail = forwardRef((props, ref) => {
  const { courseId } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const data = await getCourseProgress(courseId);
      setProgress(data);
    } catch (err) {
      console.error("Error fetching progress:", err);
      setError(err.message || "Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  // Expose refetch function to parent
  useImperativeHandle(ref, () => ({
    refetch: fetchProgress,
  }));

  useEffect(() => {
    if (courseId) {
      fetchProgress();
    }
  }, [courseId]);

  if (loading) return <div className="p-8 text-center text-gray-600 dark:text-gray-400">Loading progress...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!progress) return <div className="p-8 text-center text-gray-600 dark:text-gray-400">No progress data found</div>;

  const { stats, course } = progress;

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {course?.title || "Course"} - Learning Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your progress across lessons, quizzes, and assignments
        </p>
      </div>

      {/* ===== Overall Progress Card ===== */}
      <div className="bg-white dark:bg-[#1f2337] rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Progress</h2>
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats?.overallProgress || 0}%
          </span>
        </div>
        <ProgressBar percentage={stats?.overallProgress || 0} size="lg" showLabel={false} />
        {stats?.overallProgress === 100 && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-4 font-medium">
            🎉 Congratulations! You've completed this course!
          </p>
        )}
      </div>

      {/* ===== Stats Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lessons */}
        <div className="bg-white dark:bg-[#1f2337] rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiBook className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Lessons</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats?.completedLessons || 0}/{stats?.totalLessons || 0}
          </p>
          <ProgressBar percentage={stats?.lessonsProgress || 0} size="sm" showLabel={false} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {stats?.lessonsProgress || 0}% completed
          </p>
        </div>

        {/* Quizzes */}
        <div className="bg-white dark:bg-[#1f2337] rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FiFileText className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Quizzes</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats?.passedQuizzes || 0}/{stats?.totalQuizzes || 0}
          </p>
          <ProgressBar percentage={stats?.quizzesProgress || 0} size="sm" showLabel={false} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {stats?.quizzesProgress || 0}% passed
          </p>
        </div>

        {/* Time Spent */}
        <div className="bg-white dark:bg-[#1f2337] rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiClock className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Time Spent</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.floor((stats?.totalDuration || 0) / 60)}h {(stats?.totalDuration || 0) % 60}m
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {stats?.totalDuration || 0} minutes total
          </p>
        </div>

        {/* Completion Status */}
        <div className="bg-white dark:bg-[#1f2337] rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FiCheckCircle className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Status</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {progress?.isCourseCompleted ? "✓ Completed" : "In Progress"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {progress?.isCourseCompleted
              ? "Course finished successfully"
              : `Started ${new Date(progress?.startedAt).toLocaleDateString()}`}
          </p>
        </div>
      </div>

      {/* ===== Section Progress ===== */}
      <div className="bg-white dark:bg-[#1f2337] rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Section-wise Progress
        </h2>

        <div className="space-y-4">
          {progress?.sections?.map((section, idx) => {
            const sectionLessons = section.lessons?.length || 0;
            const completedLessons = section.lessons?.filter((l) => l.isCompleted)?.length || 0;
            const sectionQuizzes = section.quizzes?.length || 0;
            const passedQuizzes = section.quizzes?.filter((q) => q.passed)?.length || 0;
            const totalItems = sectionLessons + sectionQuizzes;
            const completedItems = completedLessons + passedQuizzes;
            const sectionProgress =
              totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

            return (
              <div
                key={idx}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Section {idx + 1}: {section.section ? `Content` : "Unit"}
                  </h3>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {sectionProgress}%
                  </span>
                </div>

                <ProgressBar percentage={sectionProgress} size="md" showLabel={false} />

                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    📚 Lessons: {completedLessons}/{sectionLessons}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    📝 Quizzes: {passedQuizzes}/{sectionQuizzes}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

CourseProgressDetail.displayName = "CourseProgressDetail";

export default CourseProgressDetail;
