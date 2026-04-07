import { useState } from "react";
import { createCourse } from "../../../features/courses/services/courseService";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    level: "beginner",
    language: "English",
    thumbnail: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= FILE CHANGE =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      thumbnail: file,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await createCourse(form);
      const courseId = res.data.id;

      navigate(`/trainer/courses/${courseId}/builder`, {
        state: { course: res.data },
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Create New Course
        </h1>
        <p className="text-sm text-gray-500">
          Fill course details to publish a new course
        </p>
      </div>

      {/* ===== Card ===== */}
      <div className="bg-white dark:bg-[#1f2337] rounded-xl shadow p-6">
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ===== Title ===== */}
          <div>
            <label className="block text-sm mb-1">Course Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Complete React Course"
              className="w-full px-4 py-2 rounded bg-[#252c45] border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* ===== Description ===== */}
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Brief overview of the course"
              className="w-full px-4 py-2 rounded bg-[#252c45] border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* ===== Thumbnail + Price ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thumbnail */}
            <div>
              <label className="block text-sm mb-1">Thumbnail</label>

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label
                  htmlFor="thumbnail"
                  className="cursor-pointer bg-[#2a3050] px-4 py-2 rounded border border-white/10 text-sm hover:bg-[#343b63]"
                >
                  Select Image
                </label>

                {form.thumbnail && (
                  <span className="text-xs text-gray-400 truncate max-w-[150px]">
                    {form.thumbnail.name}
                  </span>
                )}
              </div>

              {form.thumbnail && (
                <img
                  src={URL.createObjectURL(form.thumbnail)}
                  alt="preview"
                  className="mt-3 w-40 h-24 object-cover rounded border"
                />
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0 for free"
                className="w-full px-4 py-2 rounded bg-[#252c45] border border-white/10 outline-none"
              />
            </div>
          </div>

          {/* ===== Level + Language ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Level</label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#252c45] border border-white/10"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Language</label>
              <input
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#252c45] border border-white/10 outline-none"
              />
            </div>
          </div>

          {/* ===== Submit ===== */}
          <button
            aria-label="Create Course"
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
