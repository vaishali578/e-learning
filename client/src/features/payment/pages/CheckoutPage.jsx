import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CourseCheckout from "@/features/payment/components/CourseCheckout";
import { getCourseById } from "@/features/courses/services/courseService";
import { BookOpen, Star, Clock, ShieldCheck, ArrowLeft, Award } from "lucide-react";

export default function CheckoutPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        setError("Failed to load course details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Loading checkout details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 text-white p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-md text-center">
          <p className="text-red-400 font-medium text-lg mb-4">{error || "Course not found"}</p>
          <Link to="/courses" className="inline-flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all font-semibold">
            <ArrowLeft className="w-4 h-4" /> Return to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Navigation */}
        <div className="mb-8">
          <Link to={`/courses/${courseId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to course page</span>
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-10">
          Complete Your Enrollment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Course Details Card */}
          <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pb-6 border-b border-slate-800">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full sm:w-32 h-24 object-cover rounded-2xl border border-slate-800 shadow-md"
                />
              ) : (
                <div className="w-full sm:w-32 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center border border-slate-700 shadow-md">
                  <BookOpen className="w-8 h-8 text-white/80" />
                </div>
              )}
              <div className="flex-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider mb-2">
                  {course.level || "All Levels"}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight text-white">
                  {course.title}
                </h2>
              </div>
            </div>

            {/* Course Details Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>{course.totalDuration ? `${course.totalDuration} hours` : "Self-paced"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>{course.totalLessons || 0} lessons</span>
              </div>
              {course.rating > 0 && (
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-white">{course.rating}</span>
                  <span className="text-slate-400">({course.reviewsCount || 0} reviews)</span>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Course Description</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                {course.description ? (
                  course.description.length > 250 ? `${course.description.substring(0, 250)}...` : course.description
                ) : (
                  "Master this subject with lifetime access, comprehensive videos, assignments, and certificates."
                )}
              </p>
            </div>

            {/* Value Props / Guarantee */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Shareable Certificate</h4>
                  <p className="text-xs text-slate-400">Earn a certificate upon completion</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Lifetime Access</h4>
                  <p className="text-xs text-slate-400">Learn at your own pace anytime</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Form / Payment Card */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
              <span>Secure Checkout</span>
              <span className="text-xs font-normal text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SSL Encrypted
              </span>
            </h3>

            {/* Price breakdown */}
            <div className="bg-slate-950/60 rounded-2xl p-4 mb-6 border border-slate-800/40">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Original Price</span>
                <span>${((course.price || 0) * 1.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-emerald-400 mb-4">
                <span>Discount (Limited Time Offer)</span>
                <span>-${((course.price || 0) * 0.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-800 font-bold">
                <span className="text-white text-base">Total Payment</span>
                <span className="text-2xl text-blue-400">${(course.price || 0).toFixed(2)}</span>
              </div>
            </div>

            <CourseCheckout course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}

