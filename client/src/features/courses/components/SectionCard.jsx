import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import ContentCard from "./ContentCard";
import ContentTypeButtons from "./ContentTypeButtons";
import { updateSection } from "@/features/courses/services/sectionService";
import toast from "react-hot-toast";

export default function SectionCard({
  section,
  setCourse,
  openAddContentModal,
  removeContent,
  removeSection,
}) {
  const [title, setTitle] = useState(section.title);
  const [saving, setSaving] = useState(false);

  /* ================= UPDATE TITLE ================= */
  const handleUpdate = async () => {
    if (!title.trim()) return;

    // If no change, skip API call
    if (title === section.title) return;

    try {
      setSaving(true);

      await updateSection(section._id, title);

      // Update parent state after success
      setCourse((c) => ({
        ...c,
        sections: c.sections.map((s) =>
          s._id === section._id ? { ...s, title } : s
        ),
      }));

      toast.success("Section updated");
    } catch (error) {
      toast.error("Update failed");
      setTitle(section.title); // revert on error
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="
        relative
        bg-white dark:bg-[#1f2337]
        rounded-xl
        p-5
        shadow-sm
        hover:shadow-md
        transition-all duration-200
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        {/* Title Input */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
          disabled={saving}
          className="
            w-full
            text-sm font-semibold
            bg-transparent
            outline-none
            text-gray-900 dark:text-white
            placeholder-gray-400
            disabled:opacity-60
          "
        />

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          <button
          aria-label="Toggle Section Visibility"
            type="button"
            className="
              p-2 rounded-md
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
              text-gray-400 dark:text-gray-500
            "
          >
            <ChevronDown size={18} />
          </button>

          <button
          aria-label="Remove Section"
            type="button"
            onClick={() => removeSection?.(section._id)}
            className="
              p-2 rounded-md
              hover:bg-red-500/10
              text-gray-400 hover:text-red-500
              transition
            "
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-700 mb-4" />

      {/* Content List */}
      {section.contents.length > 0 ? (
        <div className="space-y-2">
          {section.contents.map((item, index) => (
            <ContentCard
              key={item._id || item.id || `content-${section._id}-${index}`}
              content={item}
              sectionId={section._id}
              onRemove={removeContent}
            />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          No content added yet
        </p>
      )}

      <ContentTypeButtons
        sectionId={section._id}
        openAddContentModal={openAddContentModal}
      />
    </div>
  );
}