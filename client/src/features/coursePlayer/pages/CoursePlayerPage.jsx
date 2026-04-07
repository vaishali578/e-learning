import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiBarChart2 } from "react-icons/fi";

import VideoPlayer from "../components/VideoPlayer";
import LessonInfo from "../components/LessonInfo";
import AssignmentInfo from "../components/AssignmentInfo";
import AssignmentSubmission from "../components/AssignmentSubmission";
import CourseSidebar from "../components/CourseSidebar";
import QuizPlayer from "../components/QuizPlayer";
import QuizResult from "../components/QuizResult";

import { getCoursePlayerData, getQuizResultsById } from "../services/coursePlayer.service";
import { getCourseProgress } from "@/features/progress/services/progressService";

export default function CoursePlayerPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [sections, setSections] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState(null);

  // ✅ Track quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({}); // store student answers
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Fetch progress data
  const fetchProgress = async () => {
    try {
      const data = await getCourseProgress(courseId);
      setCourseProgress(data);
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  };

  const handleProgressUpdate = () => {
    // Refetch progress when a lesson is marked complete
    fetchProgress();
  };

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await getCoursePlayerData(courseId);
        const allSections = data.sections || [];
        setSections(allSections);

        // pick first available content
        const items = allSections.flatMap((section) => [
          ...(section.lessons || []).map((l) => ({ ...l, itemType: "lesson" })),
          ...(section.assignments || []).map((a) => ({
            ...a,
            itemType: "assignment",
          })),
          ...(section.quizzes || []).map((q) => ({ ...q, itemType: "quiz" })),
        ]);

        setActiveItem(items.length ? items[0] : null);
      } catch (err) {
        console.error("Course player error", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
    fetchProgress();
  }, [courseId]);

  if (loading) return <div className="p-10 text-gray-900 dark:text-white">Loading course...</div>;
  if (!activeItem) return <div className="p-10 text-gray-900 dark:text-white">No content found</div>;

  return (
    <div className="h-screen bg-gray-100 dark:bg-[#1a1d2e] flex">
      {/* LEFT SIDEBAR */}
      <CourseSidebar
        sections={sections}
        activeItemId={activeItem._id}
        onSelectItem={(item) => {
          setActiveItem(item);
          if (item.itemType === "quiz") {
            setQuizStarted(false); // reset quiz
            setShowQuizResult(false);
          }
        }}
      />

      {/* RIGHT CONTENT */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#26283e] p-6">
        {/* PROGRESS BUTTON */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-4">
            {courseProgress && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-[#1f2337] rounded-lg">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Progress: <span className="font-bold text-blue-600 dark:text-blue-400">{courseProgress.completionPercentage || 0}%</span>
                </span>
              </div>
            )}
            <button
            aria-label="View Course Progress"
              onClick={() => navigate(`/student/courses/${courseId}/progress`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
            >
              <FiBarChart2 size={16} />
              View Progress
            </button>
          </div>
        </div>

        {/* LESSON */}
        {activeItem.itemType === "lesson" && (
          <>
            <LessonInfo lesson={activeItem} />
            <VideoPlayer 
              videoUrl={activeItem?.video?.url} 
              lesson={activeItem}
              onProgressUpdate={handleProgressUpdate}
            />
          </>
        )}

        {/* ASSIGNMENT */}
        {activeItem.itemType === "assignment" && (
          <>
            <AssignmentInfo assignment={activeItem} />
            <AssignmentSubmission 
              assignment={activeItem}
              onProgressUpdate={handleProgressUpdate}
            />
          </>
        )}

        {/* QUIZ START SCREEN */}
        {activeItem.itemType === "quiz" && !quizStarted && !showQuizResult && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{activeItem.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{activeItem.description}</p>
            <button
            aria-label="Start Quiz"
              onClick={() => setQuizStarted(true)}
              className="px-6 py-3 bg-black dark:bg-blue-600 text-white rounded hover:bg-gray-900 dark:hover:bg-blue-700 transition"
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* QUIZ PLAYER */}

        {activeItem.itemType === "quiz" && quizStarted && !showQuizResult && (
          <QuizPlayer
            quizId={activeItem._id}
            onSubmit={async (answers, fullQuiz) => {
              // store both answers and full quiz
              setQuizAnswers({ answers, fullQuiz });

              // stop quiz
              setQuizStarted(false);
              setShowQuizResult(true);

              // Fetch quiz with answers for results display
              try {
                const quizWithAnswers = await getQuizResultsById(activeItem._id);
                setActiveItem({
                  ...quizWithAnswers.quiz,
                  itemType: "quiz",
                  questions: quizWithAnswers.questions || [],
                });
              } catch (err) {
                console.error("Error fetching quiz results:", err);
                // Fallback to original quiz data
                setActiveItem({
                  ...fullQuiz,
                  itemType: "quiz",
                  questions: fullQuiz.questions || [],
                });
              }
            }}
          />
        )}

        {/* QUIZ RESULT */}
        {activeItem.itemType === "quiz" && showQuizResult && (
          <QuizResult
            quiz={activeItem} // now contains questions
            answers={quizAnswers.answers} // student answers
          />
        )}
      </div>
    </div>
  );
}
