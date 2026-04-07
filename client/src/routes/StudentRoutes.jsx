import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/routes/gaurds/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Lazy imports
const StudentDashboard = lazy(
  () => import("../pages/student/dashboard/StudentDashboard"),
);
const AllCoursesPage = lazy(
  () => import("@/features/courses/pages/AllCoursesPage"),
);
const MyCoursesPage = lazy(
  () => import("@/pages/student/courses/MyCoursesPage"),
);
const FindPeople = lazy(() => import("@/features/findPeople/pages/FindPeople"));
const Assignments = lazy(() => import("../pages/student/assignments/page"));
const Chat = lazy(() => import("../features/chat/pages/ChatPage"));
const Profile = lazy(() => import("../features/profile/pages/Profile"));
const Quiz = lazy(() => import("../pages/student/quiz/Page"));
const SchedulePage = lazy(
  () => import("@/features/schedule/pages/SchedulePage"),
);
const LiveClasses = lazy(() => import("@/pages/student/liveclass/Page"));
const Certificates = lazy(() => import("@/pages/student/certificates/Page"));
const AnnouncementsPage = lazy(
  () => import("@/features/announcements/pages/AnnouncementsPage"),
);
const CheckoutPage = lazy(
  () => import("@/features/payment/pages/CheckoutPage"),
);
const CoursePlayerPage = lazy(() => import("@/features/coursePlayer"));
const ProgressPage = lazy(() => import("@/pages/student/progress/ProgressPage"));

const StudentRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="courses/:courseId" element={<CoursePlayerPage />} />

        <Route
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="explore-courses" element={<AllCoursesPage />} />
          <Route path="my-courses" element={<MyCoursesPage />} />
          <Route path="find-people" element={<FindPeople />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="quizzes" element={<Quiz />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="live-classes" element={<LiveClasses />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="checkout/:courseId" element={<CheckoutPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default StudentRoutes;
