import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./gaurds/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Lazy imports
const TrainerDashboard = lazy(
  () => import("@/pages/trainer/dashboard/TrainerDashboard"),
);
const ChatPage = lazy(() => import("@/features/chat/pages/ChatPage"));
const FindPeople = lazy(() => import("@/features/findPeople/pages/FindPeople"));
const CreateCourse = lazy(() => import("@/pages/trainer/courses/CreateCourse"));
const MyCourses = lazy(() => import("@/features/courses/pages/MyCourses"));
const Profile = lazy(() => import("@/features/profile/pages/Profile"));
const TrainerAssignmentsPage = lazy(() => import("@/pages/trainer/assignments/AssignmentsPage"));
const TrainerQuizzesPage = lazy(() => import("@/pages/trainer/quizzes/QuizzesPage"));
const CourseBuilderPage = lazy(
  () => import("@/pages/trainer/courses/CourseBuilderPage"),
);
const CoursePlayerPage = lazy(() => import("@/features/coursePlayer"));
const TrainerSchedulePage = lazy(
  () => import("@/pages/trainer/schedule/Page"),
);
const CreateSchedulePage = lazy(
  () => import("@/pages/trainer/schedule/CreateSchedule"),
);

const TrainerRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          element={
            <ProtectedRoute allowedRoles={["trainer"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TrainerDashboard />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="find-people" element={<FindPeople />} />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="assignments" element={<TrainerAssignmentsPage />} />
          <Route path="quizzes" element={<TrainerQuizzesPage />} />
          <Route path="schedule" element={<TrainerSchedulePage />} />
          <Route path="schedule/create" element={<CreateSchedulePage />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="courses/:courseId/builder"
            element={<CourseBuilderPage />}
          />
        </Route>

        <Route path="/courses/:courseId" element={<CoursePlayerPage />} />
      </Routes>
    </Suspense>
  );
};

export default TrainerRoutes;
