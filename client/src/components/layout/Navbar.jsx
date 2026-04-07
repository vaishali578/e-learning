import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMenu,
  FiBell,
  FiMail,
  FiCalendar,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useTheme } from "@/hooks/useTheme";
import logout from "@/utils/logout";
import { getUserName ,getUserRole } from "@/utils/getUser";
import { getUserAvatar } from "@/utils/getUserAvatar";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const user = getUserName();
  const role = getUserRole();

  // Role-based profile links
  const profileBase = `/${role}/profile`;

  return (
    <header
      className={`fixed top-0 right-0 z-50 h-18
      border-b border-gray-200 dark:border-white/10
      bg-white dark:bg-[#26283e]
      px-4 flex items-center justify-between
      text-gray-700 dark:text-[#aeb5c4]
      transition-all duration-300
      ${isSidebarOpen ? "left-60" : "left-20"}`}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
        aria-label="Menu"
          onClick={toggleSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-md
                     hover:bg-gray-200 dark:hover:bg-[#3a3c50]"
        >
          <FiMenu size={20} />
        </button>

        <div className="hidden md:flex items-center relative">
          <FiSearch className="absolute left-3 text-gray-400" />
          <input
            placeholder="Search anything..."
            className="pl-10 pr-4 py-2 text-sm w-64 rounded-full
                       bg-gray-100 dark:bg-[#1f2035]
                       border border-gray-300 dark:border-[#515268]
                       placeholder:text-gray-400
                       text-gray-900 dark:text-white
                       focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="hidden xl:flex gap-6 text-sm">
          <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white">
            Reports & Analytics
          </span>
          <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white">
            Help
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <button
        aria-label="Theme"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center
                     hover:bg-gray-200 dark:hover:bg-[#3a3c50]"
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>

        <div className="h-10 w-px bg-gray-300 dark:bg-[#51545e]" />

        <button aria-label="Mail" className="relative w-9 h-9 rounded-full hover:bg-gray-200 dark:hover:bg-[#3a3c50] flex items-center justify-center">
          <FiMail />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <button aria-label="Notification" className="w-9 h-9 rounded-full hover:bg-gray-200 dark:hover:bg-[#3a3c50] flex items-center justify-center">
          <FiBell />
        </button>

        <button aria-label="Calender" className="w-9 h-9 rounded-full hover:bg-gray-200 dark:hover:bg-[#3a3c50] flex items-center justify-center">
          <FiCalendar />
        </button>

        <div className="h-10 w-px bg-gray-300 dark:bg-[#51545e]" />

        <div className="relative">
          <button
          aria-label="Profile"
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2"
          >
            <div className="hidden lg:block text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user || "Robert Brown"}
              </p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <RiArrowDropDownLine className="w-5 h-5" />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </div>
            </div>
            <img
              src={getUserAvatar(user.avatar)}
              className="w-9 h-9 rounded-full"
            />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-[#26283e]
                            border border-gray-200 dark:border-[#37384b]
                            rounded-md shadow-lg text-sm">
              <ul className="py-1">
                <li
                  onClick={() => navigate(profileBase)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3c50] cursor-pointer"
                >
                  View Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3c50] cursor-pointer">
                  My Tasks
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3c50] cursor-pointer">
                  Account Settings
                </li>
                <li className="border-t my-1 border-gray-200 dark:border-[#37384b]" />
                <li
                  onClick={() => logout(navigate, role)}
                  className="px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-[#3a3c50] cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
