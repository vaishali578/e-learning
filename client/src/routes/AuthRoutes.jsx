import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./gaurds/PublicRoutes";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
