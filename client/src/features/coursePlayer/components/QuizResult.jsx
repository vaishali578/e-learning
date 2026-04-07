import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { markItemComplete } from "@/features/progress/services/progressService";

export default function QuizResult({ quiz, answers }) {
  const { courseId } = useParams();

  useEffect(() => {
    if (quiz && answers && courseId) {
      trackQuizProgress();
    }
    // eslint-disable-next-line
  }, [quiz, answers, courseId]);

  const calculateResult = () => {
    let totalMarks = 0;
    let obtainedMarks = 0;

    quiz.questions.forEach((q) => {
      totalMarks += q.marks || 1;

      const selectedIndex = answers?.[q._id?.toString()];
      const correctOptionIndex = q.options?.findIndex((o) => o.isCorrect);

      if (
        selectedIndex === correctOptionIndex &&
        selectedIndex !== undefined &&
        selectedIndex !== -1
      ) {
        obtainedMarks += q.marks || 1;
      }
    });

    return { totalMarks, obtainedMarks };
  };

  const trackQuizProgress = async () => {
    try {
      const { totalMarks, obtainedMarks } = calculateResult();

      const passed =
        totalMarks > 0 && obtainedMarks >= totalMarks * 0.4; // 40% pass

      if (passed) {
        await markItemComplete({
          courseId,
          itemId: quiz._id,
          itemType: "quiz",
        });
      }
    } catch (error) {
      console.error("Error tracking quiz progress:", error);
    }
  };

  if (!quiz) return <div>Quiz data not found!</div>;
  if (!quiz.questions?.length)
    return <div>No questions available in this quiz!</div>;

  const { totalMarks, obtainedMarks } = calculateResult();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        {quiz.title} - Result
      </h2>

      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Score: {obtainedMarks} / {totalMarks}
      </p>

      {quiz.questions.map((q, index) => {
        const selectedIndex = answers?.[q._id?.toString()];
        const correctOptionIndex = q.options?.findIndex(
          (o) => o.isCorrect
        );

        return (
          <div
            key={q._id}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-[#1f2337]"
          >
            <div className="flex items-start gap-3">
              <span className="font-medium text-gray-400 dark:text-gray-500">
                {index + 1}.
              </span>
              <p className="font-medium text-gray-900 dark:text-white">
                {q.text}
              </p>
            </div>

            <div className="mt-4 ml-6 space-y-3">
              {q.options.map((opt, optionIndex) => {
                const isSelected = selectedIndex === optionIndex;
                const correct = optionIndex === correctOptionIndex;

                return (
                  <div
                    key={optionIndex}
                    className={`flex items-center gap-3 p-3 rounded border
                      ${
                        correct
                          ? "border-green-500 bg-green-100 dark:bg-green-900/50 dark:border-green-600"
                          : isSelected && !correct
                          ? "border-red-500 bg-red-100 dark:bg-red-900/50 dark:border-red-600"
                          : "border-gray-200 dark:border-gray-700"
                      }
                    `}
                  >
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {opt.text}
                    </span>

                    {correct && (
                      <span className="ml-auto text-green-600 dark:text-green-400 font-semibold">
                        ✔
                      </span>
                    )}

                    {isSelected && !correct && (
                      <span className="ml-auto text-red-600 dark:text-red-400 font-semibold">
                        ✖
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}