import React from "react";
import { Link } from "react-router-dom";

const AuthLinks = ({ showRemember = true, signupText = "Sign Up" }) => {
  return (
    <div className="flex flex-col gap-2 mt-2 text-sm">
      <div className="flex justify-between">
        {showRemember && (
        <label className="flex items-center gap-2 text-gray-300">
          <input type="checkbox" className="rounded" />
          Remember Me
        </label>
      )}
      <Link to="/forgot-password" className="text-blue-500 hover:underline">
        Forgot Password?
      </Link>
      </div>
    </div>
  );
};

export default AuthLinks;
