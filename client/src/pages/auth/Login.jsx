import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import AuthLayout from "../../features/auth/components/AuthLayout";
import AuthForm from "../../features/auth/components/AuthForm";
import SocialLogin from "../../features/auth/components/SocialLogin";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { loginApi } from "../../features/auth/authApi";
import toast from "react-hot-toast";

import logo from "../../assets/images/auth/logo.jpg";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginApi(formData);

      const { token, user } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ role based redirect (backend truth)
      if (user.role === "student") {
        navigate("/student/dashboard");
      } else if (user.role === "trainer") {
        navigate("/trainer/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error("Invalid username or password")
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <AuthLayout
      heading="Welcome Back!"
      subheading="Manage your learning journey seamlessly. Access courses, track progress, and stay connected."
    >
      

      <div className="flex mb-4 justify-center flex-col text-center">
        <h3 className="font-bold mb-2 text-md text-white">
          Welcome to E-Learning
        </h3>
        <p className="text-sm">Sign in to access your secure dashboard.</p>
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

        <TabsContent value="student">
          <AuthForm
            type="login"
            role="Student"
            buttonColor="bg-[#316aff]"
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="trainer">
          <AuthForm
            type="login"
            role="Trainer"
            buttonColor="bg-[#22c55e]"
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </TabsContent>
      </Tabs>

      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <Link className="text-blue-500 hover:underline" to="/auth/signup">
          Sign Up here
        </Link>
      </p>

      {/* Social Login */}
      <SocialLogin />
    </AuthLayout>
  );
};

export default Login;
