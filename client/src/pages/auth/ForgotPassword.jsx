import React from "react";
import AuthLayout from "../../features/auth/components/AuthLayout";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <AuthLayout
      heading="Forgot your password?"
      subheading="No worries. Enter your email and we’ll send you a reset link."
    >
      {/* Card Content */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          Reset Password
        </h2>
        <p className="text-sm opacity-70">
          Enter your registered email address
        </p>
      </div>

      {/* Form */}
      <form className="space-y-5">
        <div>
          <label className="block text-sm mb-1">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-md bg-[#282b44] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#316aff]/40"
          />
        </div>

        <button
          aria-label="Send reset link"
          type="submit"
          className="w-full bg-[#316aff] text-white py-2.5 rounded-md hover:opacity-90 transition text-sm"
        >
          Send Reset Link
        </button>
      </form>

      {/* Back to Login */}
      <p className="text-sm text-center mt-6">
        Remember your password?
        <Link
          to="/login"
          className="text-[#316aff] ml-1 hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
