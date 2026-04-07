import React from "react";

const SocialLogin = () => {
  const icons = ["facebook-f", "x-twitter", "github"];
  return (
    <div className="w-full mt-6">
      {/* Divider with text */}
      <div className="relative flex items-center justify-center mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <span className="px-3 text-sm text-gray-400 bg-[#26283e] z-10">
          or continue with
        </span>
      </div>

      {/* Social buttons */}
      <div className="flex justify-center gap-4">
        {icons.map((icon) => (
          <button
          aria-label={`Login with ${icon}`}
            key={icon}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition"
          >
            <i className={`fa-brands fa-${icon}`}></i>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialLogin;
