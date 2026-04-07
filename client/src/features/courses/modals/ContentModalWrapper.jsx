import LessonModal from "./LessonModal";
import QuizModal from "./QuizModal";
import AssignmentModal from "./AssignmentModal";

export default function ContentModalWrapper({
  type,
  sectionId,
  courseId,
  onClose,
  onSubmit,
}) {
  switch (type) {
    case "lesson":
      return (
        <LessonModal
        sectionId={sectionId}
        courseId={courseId} 
          onClose={onClose}
          onSubmit={(newContent) => {
            onSubmit(newContent);
          }}
        />
      );

    case "quiz":
      return (
        <QuizModal
        sectionId={sectionId}
        courseId={courseId} 
          onClose={onClose}
          onSubmit={onSubmit}
        />
      );

    case "assignment":
      return (
        <AssignmentModal
        sectionId={sectionId}
        courseId={courseId} 
          onClose={onClose}
          onSubmit={onSubmit}
        />
      );

    default:
      return null;
  }
}