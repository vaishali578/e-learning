export default function AssignmentInfo({ assignment }) {
  return (
    <div className="p-8 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-[#26283e]">
      <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
        {assignment.title}
      </h2>

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Max Marks: {assignment.maxMarks}
        {assignment.dueDate && (
          <> | Due: {new Date(assignment.dueDate).toDateString()}</>
        )}
      </div>

      <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-300 text-sm">
        {assignment.instructions}
      </pre>
    </div>
  );
}
