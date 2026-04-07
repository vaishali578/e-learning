import { useState, useEffect } from "react";
import QuizCard from "./QuizCard";
import { getStudentQuizzes } from "@/features/courses/services/quizService";

const CompletedQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getStudentQuizzes();
      setQuizzes(data.completed || []);
    } catch (err) {
      console.error("Error fetching completed quizzes:", err);
      setError(err.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10">
      {/* Section Header */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Completed Quizzes
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Review your past quiz performance
        </p>
      </div>

      {/* States */}
      {loading && (
        <div className="py-10 text-center text-gray-500">
          Loading completed quizzes…
        </div>
      )}

      {error && (
        <div className="py-10 text-center text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && quizzes.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          You haven’t completed any quizzes yet.
        </div>
      )}

      {!loading && !error && quizzes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz) => (
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
              completed
              score={quiz.bestScore}
              passMarks={quiz.passMarks}
              totalMarks={quiz.totalMarks}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CompletedQuizzes;
