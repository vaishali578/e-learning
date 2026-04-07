import { FiSearch } from "react-icons/fi";

const QuizToolbar = () => {
  return (
    <div className="mb-8">
      {/* Heading */}
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Quizzes & Tests
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Attempt quizzes and track your results
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          placeholder="Search quizzes..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm
            bg-white dark:bg-[#1f2337]
            border border-gray-200 dark:border-white/10
            text-gray-900 dark:text-white
            placeholder:text-gray-400
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default QuizToolbar;
