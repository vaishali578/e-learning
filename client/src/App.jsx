import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import SocketProvider from "@/context/SocketProvider";

// Lazy imports
const StudentRoutes = lazy(() => import("./routes/StudentRoutes"));
const TrainerRoutes = lazy(() => import("./routes/TrainerRoutes"));
const AuthRoutes = lazy(() => import("./routes/AuthRoutes"));
const LandingPage = lazy(() => import("./pages/Landing/LandingPage"));

function App() {
  const token = localStorage.getItem("token");

  return (
    <SocketProvider token={token}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth */}
          <Route path="/auth/*" element={<AuthRoutes />} />

          {/* Student */}
          <Route path="/student/*" element={<StudentRoutes />} />

          {/* Trainer */}
          <Route path="/trainer/*" element={<TrainerRoutes />} />
        </Routes>
      </Suspense>
    </SocketProvider>
  );
}

export default App;