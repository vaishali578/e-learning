import React from "react";
import authBg from "../../../assets/images/auth/auth-cover-bg.png";
import authImg from "../../../assets/images/auth/auth.png";

const AuthLayout = ({ children, heading, subheading }) => {
  return (
    <div className="min-h-screen w-full flex bg-[#26283e] text-[#9aa4bf]">
      {/* LEFT COVER */}
      <div
        className="hidden lg:flex lg:w-1/2 relative m-8 rounded-2xl overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${authBg})` }}
      >
        <div className="flex flex-col justify-center items-center px-16 text-white bg-black/20 w-full">
          <img src={authImg} alt="Auth" className="w-96 mb-8 animate-float" />
          <h1 className="text-4xl font-bold mb-4">{heading}</h1>
          <p className="text-center text-base opacity-70 max-w-md">
            {subheading}
          </p>
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
      
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
