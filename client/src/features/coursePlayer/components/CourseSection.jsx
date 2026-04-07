export default function CourseSection({ title, children }) {
  return (
    <div className="border-b border-gray-300 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 font-medium text-gray-900 dark:text-white">
        📂 {title}
      </div>
      <div className="pl-6 pb-2">{children}</div>
    </div>
  );
}
