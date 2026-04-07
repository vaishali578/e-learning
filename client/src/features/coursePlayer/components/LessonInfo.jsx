export default function LessonInfo({ lesson }) {
  return (
    <div className="p-10">
      <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
        {lesson.title}
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        {/* future text lesson content */}
        Lesson description will appear here.
      </p>
    </div>
  );
}
