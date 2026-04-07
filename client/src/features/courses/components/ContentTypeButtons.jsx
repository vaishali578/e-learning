import { BookOpen, ClipboardList, HelpCircle, Plus } from "lucide-react";

const contentTypes = [
  {
    type: "lesson",
    label: "Lesson",
    icon: BookOpen,
    color: "text-blue-500 dark:text-blue-400",
  },
  {
    type: "assignment",
    label: "Assignment",
    icon: ClipboardList,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    type: "quiz",
    label: "Quiz",
    icon: HelpCircle,
    color: "text-green-600 dark:text-green-400",
  },
];

export default function ContentTypeButtons({ sectionId, openAddContentModal }) {
  return (
    <div className="mt-4 flex gap-3 flex-wrap">
      {contentTypes.map(({ type, label, icon: Icon, color }) => (
        <button
        aria-label={`Add ${label}`}
          key={type}
          onClick={() => {
            openAddContentModal( type);
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium cursor-pointer
          rounded-lg border border-gray-200 dark:border-gray-700
          bg-white dark:bg-[#1f2337]
          hover:bg-gray-100 dark:hover:bg-darkHover
          transition shadow-sm hover:shadow-md"
        >
          <span
            className={`p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 ${color}`}
          >
            <Icon size={14} />
          </span>

          <span className="text-gray-700 dark:text-gray-300">Add {label}</span>

          <Plus size={12} className="ml-1 text-gray-400" />
        </button>
      ))}
    </div>
  );
}
