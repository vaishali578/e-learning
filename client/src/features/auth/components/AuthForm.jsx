import AuthLinks from "@/features/auth/components/AuthLinks";

const AuthForm = ({
  type = "login", // "login" | "signup"
  role,
  buttonColor,
  formData,
  onChange,
  onSubmit,
  loading = false,
  error = ""
}) => {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {/* NAME – ONLY FOR SIGNUP */}
      {type === "signup" && (
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input
          name="name"
          value={formData.name || ""}
          onChange={onChange}
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-2 rounded-md bg-[#282b44] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#316aff]/40"
          />
        </div>
      )}

      {/* EMAIL */}
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
        name="email"
        onChange={onChange}
        value={formData.email}
          type="email"
          placeholder={`${role.toLowerCase()}@example.com`}
          className="w-full px-4 py-2 rounded-md bg-[#282b44] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#316aff]/40"
        />
      </div>

      {/* PASSWORD */}
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input
          name="password"
          onChange={onChange}
          value={formData.password}
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-2 rounded-md bg-[#282b44] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#316aff]/40"
        />
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded">{error}</p>
      )}

      {/* EXTRA LINKS ONLY ON LOGIN */}
      {type === "login" && <AuthLinks />}

      <button
        className={`w-full ${buttonColor} text-white text-sm cursor-pointer py-2.5 rounded-md hover:opacity-90 transition`}
      >
        {role} {type === "login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
};

export default AuthForm;
