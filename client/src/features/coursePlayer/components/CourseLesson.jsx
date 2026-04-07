import { Lock, FileText, Edit3 } from "lucide-react";

export default function CourseLesson({
  title,
  duration,
  active,
  isLocked,
  onClick,
  type = "lesson", // default type
}) {
  const renderIcon = () => {
    if (type === "assignment") return <Edit3 size={14} />;
    if (type === "quiz") return <FileText size={14} />;
    return null; 
  };

  return (
    <div
      onClick={!isLocked ? onClick : undefined}
      className={`flex items-center justify-between p-2 rounded mb-1 text-sm
        ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${active ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-[#2a2d40] text-gray-900 dark:text-gray-300"}
      `}
    >
      <span className="flex items-center gap-2">
        {isLocked && <Lock size={14} />}
        {renderIcon()}
        {title}
      </span>

      <span className="text-xs text-gray-500 dark:text-gray-400">{duration}</span>
    </div>
  );
}
