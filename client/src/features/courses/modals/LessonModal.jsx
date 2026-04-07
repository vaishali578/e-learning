import { X } from "lucide-react";
import { useState } from "react";
import { createLesson } from "../services/lessonService";
import { uploadLessonVideo } from "../services/uploadService";

export default function LessonModal({
  sectionId,
  courseId,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    title: "",
    type: "video",
    content: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null); // ← Added for better UX

  const handleSave = async () => {
    setError(null);

    if (!form.title.trim()) {
      setError("Lesson title is required");
      return;
    }

    if (form.type === "video" && !videoFile) {
      setError("Please select a video file");
      return;
    }

    if (form.type === "article" && !form.content.trim()) {
      setError("Please enter article content");
      return;
    }

    // Optional: Add validation for "live" type if you have specific requirements
    // if (form.type === "live" && !someLiveField) { ... }

    try {
      setSaving(true);

      let videoData = null;

      // 1. Upload video if needed
      if (form.type === "video") {
        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("courseId", courseId);
        formData.append("sectionId", sectionId);

        const uploadRes = await uploadLessonVideo(formData);


        videoData = {
          url: uploadRes.url,
          duration: uploadRes.duration,
          provider: "cloudinary",
        };
      }

      // 2. Create the lesson
      const lessonData = {
        title: form.title.trim(),
        type: form.type,
        courseId,
        sectionId,
      };

      if (form.type === "video") lessonData.video = videoData;
      if (form.type === "article") lessonData.content = form.content.trim();

      

      const createdLesson = await createLesson(lessonData);

      

      // 3. Notify parent (CourseBuilderPage / SectionCard)
      if (onSubmit) {
        const cleanLesson = createdLesson?.data || createdLesson; // backend wrapper hata do
       
        onSubmit(cleanLesson);
      }

      // 4. Success → close modal
      onClose();
    } catch (err) {
      

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create lesson. Please try again.";

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1f2337] rounded-xl w-full max-w-lg p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Lesson</h2>
          <button
          aria-label="Close Lesson Modal"
            className="cursor-pointer"
            onClick={onClose}
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <input
          placeholder="Lesson title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border placeholder:text-sm rounded-md p-2"
          disabled={saving}
        />

        {/* Type */}
        <select
          className="w-full border text-sm rounded-md p-2"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          disabled={saving}
        >
          <option value="video">Video</option>
          <option value="article">Article</option>
          <option value="live">Live</option>
        </select>

        {/* Conditional Fields */}
        {form.type === "video" && (
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className="w-full text-sm border rounded-lg p-2"
            disabled={saving}
          />
        )}

        {form.type === "article" && (
          <textarea
            placeholder="Write lesson content here..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full border rounded-lg p-2 h-32"
            disabled={saving}
          />
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
          aria-label="Cancel Lesson Creation"
            onClick={onClose}
            className="px-4 cursor-pointer py-2 text-sm border rounded-lg"
            disabled={saving}
          >
            Cancel
          </button>

          <button
          aria-label="Save Lesson"
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white cursor-pointer rounded-lg"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}
