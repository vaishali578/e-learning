import { useState, useEffect } from "react";
import QuizToolbar from "./QuizToolbar";
import QuizCard from "./QuizCard";
import { getStudentQuizzes } from "@/features/courses/services/quizService";

const ActiveQuizzes = () => {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getStudentQuizzes();

      const combined = [
        ...(data.active || []).map(q => ({ ...q, completed: false })),
        ...(data.completed || []).map(q => ({ ...q, completed: true })),
      ];

      setAllQuizzes(combined);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setError(err.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Toolbar */}
      <QuizToolbar />

      {/* Content Container */}
      <div>
        {/* States */}
        {loading && (
          <div className="py-12 text-center text-gray-500">
            Loading quizzes…
          </div>
        )}

        {error && (
          <div className="py-12 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && allQuizzes.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No quizzes available at the moment
          </div>
        )}

        {/* Quiz Grid */}
        {!loading && !error && allQuizzes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                id={quiz.id}
                category={quiz.course?.title || "Course"}
                title={quiz.title}
                time={quiz.timeLimit}
                questions={quiz.totalMarks}
                level={
                  quiz.passMarks > quiz.totalMarks * 0.8
                    ? "Advanced"
                    : quiz.passMarks > quiz.totalMarks * 0.5
                    ? "Intermediate"
                    : "Beginner"
                }
                completed={quiz.completed}
                score={quiz.lastAttemptScore}
                passMarks={quiz.passMarks}
                totalMarks={quiz.totalMarks}
              />
            ))}
          </div>
        )}

        {/* Summary */}
        {!loading && !error && allQuizzes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total: {allQuizzes.length} quizzes • Completed: {allQuizzes.filter(q => q.completed).length} • Remaining: {allQuizzes.filter(q => !q.completed).length}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActiveQuizzes;
