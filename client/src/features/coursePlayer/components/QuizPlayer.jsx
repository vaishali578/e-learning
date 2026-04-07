import { useEffect, useState } from "react";
import { getQuizById } from "../services/coursePlayer.service";
import QuizTimer from "./QuizTimer";
import QuizResult from "./QuizResult"; 

export default function QuizPlayer({ quizId, onSubmit }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await getQuizById(quizId);
        setQuiz({
          ...data.quiz,
          questions: data.questions,
        });
      } catch (err) {
        console.error("Quiz load error", err);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  const handleSelect = (questionId, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResult(true); 

    // 🔜 optional: send answers to backend
    if (onSubmit) onSubmit(answers, quiz); // callback to parent if needed
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  if (loading) return <div className="p-10 text-gray-900 dark:text-white">Loading quiz...</div>;
  if (!quiz) return <div className="p-10 text-gray-900 dark:text-white">Quiz not found</div>;

  const attemptedCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* HEADER */}
      {!showResult && (
        <div className="border-b border-gray-300 dark:border-gray-700 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{quiz.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{quiz.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <QuizTimer timeLimitMinutes={quiz.timeLimit} onTimeUp={handleTimeUp} />
          </div>
        </div>
      )}

      {/* QUIZ META */}
      {!showResult && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="border border-gray-300 dark:border-gray-700 rounded-md p-3 text-center bg-white dark:bg-[#1f2337]">
            <p className="text-xs text-gray-500 dark:text-gray-400">Questions</p>
            <p className="font-semibold text-gray-900 dark:text-white">{quiz.questions.length}</p>
          </div>

          <div className="border border-gray-300 dark:border-gray-700 rounded-md p-3 text-center bg-white dark:bg-[#1f2337]">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Marks</p>
            <p className="font-semibold text-gray-900 dark:text-white">{quiz.totalMarks}</p>
          </div>

          <div className="border border-gray-300 dark:border-gray-700 rounded-md p-3 text-center bg-white dark:bg-[#1f2337]">
            <p className="text-xs text-gray-500 dark:text-gray-400">Pass Marks</p>
            <p className="font-semibold text-gray-900 dark:text-white">{quiz.passMarks}</p>
          </div>

          <div className="border border-gray-300 dark:border-gray-700 rounded-md p-3 text-center bg-white dark:bg-[#1f2337]">
            <p className="text-xs text-gray-500 dark:text-gray-400">Answered</p>
            <p className="font-semibold text-gray-900 dark:text-white">{attemptedCount} / {quiz.questions.length}</p>
          </div>
        </div>
      )}

      {/* QUIZ QUESTIONS */}
      {!showResult && (
        <div className="space-y-6">
          {quiz.questions.map((q, index) => (
            <div
              key={q._id}
              className={`border border-gray-300 dark:border-gray-700 rounded-lg p-5 transition ${submitted ? "bg-gray-50 dark:bg-[#1f2337]" : "hover:shadow-sm bg-white dark:bg-[#1f2337]"}`}
            >
              <div className="flex items-start gap-3">
                <span className="font-medium text-gray-400 dark:text-gray-500">{index + 1}.</span>
                <p className="font-medium text-gray-900 dark:text-white">{q.text}</p>
              </div>

              <div className="mt-4 ml-6 space-y-3">
                {q.options.map((opt, optionIndex) => {
                  const selected = answers[q._id] === optionIndex;
                  const correct = submitted && opt.isCorrect;

                  return (
                    <label
                      key={optionIndex}
                      className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition
                        ${
                          submitted
                            ? correct
                              ? "border-green-500 bg-green-100 dark:bg-green-900/50 dark:border-green-600"
                              : selected
                              ? "border-red-500 bg-red-100 dark:bg-red-900/50 dark:border-red-600"
                              : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1d2e]"
                            : selected
                            ? "border-black dark:border-blue-500 bg-gray-100 dark:bg-blue-900/30"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2d40]"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={q._id}
                        checked={selected}
                        onChange={() => handleSelect(q._id, optionIndex)}
                        className="accent-black dark:accent-blue-500"
                        disabled={submitted}
                      />
                      <span className="text-sm text-gray-800 dark:text-gray-200">{opt.text}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      {!showResult && (
        <div className="mt-10 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {submitted
              ? "Quiz Submitted"
              : `Answered ${attemptedCount} / ${quiz.questions.length}`}
          </p>

          <button
          aria-label="Submit Quiz"
            onClick={handleSubmit}
            disabled={submitted || attemptedCount !== quiz.questions.length}
            className={`px-6 py-2 rounded text-sm font-medium transition
              ${
                attemptedCount === quiz.questions.length && !submitted
                  ? "bg-black dark:bg-blue-600 text-white hover:bg-gray-900 dark:hover:bg-blue-700"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {submitted ? "Submitted" : "Submit Quiz"}
          </button>
        </div>
      )}

      {/* QUIZ RESULT */}
      {showResult && <QuizResult quiz={quiz} answers={answers} />}
    </div>
  );
}