import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  if (user?.role === "trainer") {
    return <Navigate to="/trainer/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
