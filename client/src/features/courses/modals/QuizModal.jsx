import { useState } from "react";
import { X } from "lucide-react";
import { createQuiz, createQuestion } from "../services/quizService";

export default function QuizModal({ sectionId, courseId, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [quiz, setQuiz] = useState({
    title: "",
    timeLimit: "",
    totalMarks: "",
    passMarks: "",
    allowedAttempts: "",
    _id: null,
  });

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionForm, setQuestionForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const [error, setError] = useState(null);

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleNext = async () => {
    setError(null);

    if (!quiz.title.trim()) return setError("Quiz title required");
    if (!quiz.totalMarks || quiz.totalMarks <= 0)
      return setError("Total marks must be > 0");
    if (!quiz.passMarks && quiz.passMarks !== 0)
      return setError("Pass marks required");
    if (Number(quiz.passMarks) > Number(quiz.totalMarks))
      return setError("Pass marks cannot exceed total marks");

    setLoading(true);

    try {
      const payload = {
        ...quiz,
        totalMarks: Number(quiz.totalMarks),
        passMarks: Number(quiz.passMarks),
        timeLimit: quiz.timeLimit ? Number(quiz.timeLimit) : undefined,
        allowedAttempts: quiz.allowedAttempts
          ? Number(quiz.allowedAttempts)
          : undefined,
        sectionId,
        courseId,
      };

      const response = await createQuiz(payload);

      setQuiz((prev) => ({ ...prev, _id: response.data.id }));
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    setError(null);

    if (!questionForm.question.trim())
      return setError("Question is required");

    if (!quiz._id) return setError("Quiz not created yet");

    try {
      const payload = {
        text: questionForm.question,
        type: "mcq",
        options: questionForm.options.map((opt) => ({
          text: opt,
          isCorrect: opt === questionForm.correctAnswer,
        })),
        marks: 1,
      };

      await createQuestion(quiz._id, payload);

      setQuestions((prev) => [
        ...prev,
        {
          question: questionForm.question,
          options: questionForm.options,
          correctAnswer: questionForm.correctAnswer,
        },
      ]);

      setQuestionForm({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add question");
    }
  };

  const handleFinish = () => {
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1f2337] rounded-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {step === 1 ? "Add Quiz" : "Add Questions"}
          </h2>
          <button aria-label="Close Quiz Modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Quiz Info */}
        {step === 1 && (
          <div className="space-y-3">
            <input
              name="title"
              placeholder="Quiz title"
              value={quiz.title}
              onChange={handleQuizChange}
              className="w-full border rounded-md p-2 text-sm"
            />

            <textarea
              name="description"
              placeholder="Quiz description"
              value={quiz.description || ""}
              onChange={handleQuizChange}
              className="w-full border rounded-md p-2 text-sm"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="timeLimit"
                placeholder="Time (mins)"
                value={quiz.timeLimit}
                onChange={handleQuizChange}
                className="border rounded-md p-2 text-sm"
              />
              <input
                type="number"
                name="totalMarks"
                placeholder="Total marks"
                value={quiz.totalMarks}
                onChange={handleQuizChange}
                className="border rounded-md p-2 text-sm"
              />
              <input
                type="number"
                name="passMarks"
                placeholder="Pass Marks"
                value={quiz.passMarks || ""}
                onChange={handleQuizChange}
                className="border rounded-md p-2 text-sm"
              />
              <input
                type="number"
                name="allowedAttempts"
                placeholder="Allowed Attempts"
                value={quiz.allowedAttempts || ""}
                onChange={handleQuizChange}
                className="border rounded-md p-2 text-sm"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="shuffleQuestions"
                checked={quiz.shuffleQuestions || false}
                onChange={(e) =>
                  setQuiz({ ...quiz, shuffleQuestions: e.target.checked })
                }
              />
              Shuffle Questions
            </label>

            <div className="flex justify-end pt-2">
              <button
              aria-label="Proceed to Add Questions"
                onClick={handleNext}
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md cursor-pointer disabled:opacity-50"
              >
                {loading ? "Creating..." : "Next: Add Questions"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Add Questions */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                placeholder="Question"
                value={questionForm.question}
                onChange={(e) =>
                  setQuestionForm({ ...questionForm, question: e.target.value })
                }
                className="w-full border rounded-md p-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                {questionForm.options.map((opt, idx) => (
                  <input
                    key={idx}
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handleQuestionChange(idx, e.target.value)}
                    className="border rounded-md p-2 text-sm"
                  />
                ))}
              </div>
              <input
                placeholder="Correct Answer"
                value={questionForm.correctAnswer}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    correctAnswer: e.target.value,
                  })
                }
                className="w-full border rounded-md p-2 text-sm"
              />
              <button
              aria-label="Add Question to Quiz"
                onClick={handleAddQuestion}
                className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md cursor-pointer"
              >
                Add Question
              </button>
            </div>

            {questions.length > 0 && (
              <div className="space-y-2 border-t pt-2">
                {questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md text-sm"
                  >
                    Q{idx + 1}: {q.question} <br />
                    Options: {q.options.join(", ")} <br />
                    Correct: {q.correctAnswer}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
              aria-label="Cancel Quiz Creation"
                onClick={onClose}
                className="px-4 py-2 text-sm border rounded-md"
              >
                Cancel
              </button>
              <button
              aria-label="Finish Quiz"
                onClick={handleFinish}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
              >
                Finish Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
