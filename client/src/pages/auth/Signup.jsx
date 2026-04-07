import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import AuthLayout from "../../features/auth/components/AuthLayout";
import AuthForm from "../../features/auth/components/AuthForm";
import SocialLogin from "../../features/auth/components/SocialLogin";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { signupApi } from "../../features/auth/authApi";

import logo from "../../assets/images/auth/logo.jpg";

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signupApi({
        ...formData,
        role,
      });

      const { token, user } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/trainer/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <AuthLayout
      heading="Join Us Today!"
      subheading="Create your account and start your learning journey with Globus E-Learning."
    >
      {/* Logo */}
      <div className="flex justify-center items-center gap-3 mb-4">
        <img src={logo} alt="Logo" className="h-6" />
        <span className="text-lg font-semibold text-[#d6d7e0]">Globussoft</span>
      </div>

      {/* Heading */}
      <div className="flex mb-4 justify-center flex-col text-center">
        <h3 className="font-bold mb-2 text-md text-white">
          Create your Globus-E-Learning account
        </h3>
        <p className="text-sm">Sign up to explore courses and start learning</p>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="student"
        className="w-full"
        onValueChange={(value) => setRole(value)}
      >
        <TabsList className="grid grid-cols-2 mb-2 bg-[#1f2238] text-white rounded-xl">
          <TabsTrigger
            value="student"
            className="text-white data-[state=active]:text-[#0f172a]"
          >
            Student
          </TabsTrigger>
          <TabsTrigger
            value="trainer"
            className="text-white data-[state=active]:text-[#0f172a]"
          >
            Trainer
          </TabsTrigger>
        </TabsList>

        {/* STUDENT SIGNUP */}
        <TabsContent value="student">
          <AuthForm
            type="signup"
            role="Student"
            buttonColor="bg-[#316aff]"
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </TabsContent>

        {/* TRAINER SIGNUP */}
        <TabsContent value="trainer">
          <AuthForm
            type="signup"
            role="Trainer"
            buttonColor="bg-[#22c55e]"
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </TabsContent>
      </Tabs>

      {/* LOGIN LINK */}
      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link className="text-blue-500 hover:underline" to="/auth/login">
          Login here
        </Link>
      </p>

      {/* SOCIAL LOGIN */}
      <SocialLogin />
    </AuthLayout>
  );
};

export default Signup;
