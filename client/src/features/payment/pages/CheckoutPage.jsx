import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CourseCheckout from "@/features/payment/components/CourseCheckout";
import { getCourseById } from "@/features/courses/services/courseService";

export default function CheckoutPage() {
  const { courseId } = useParams(); // ✅ FIX

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
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return <p className="text-center mt-10">Loading course...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <CourseCheckout course={course} />
    </div>
  );
}
