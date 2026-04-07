import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ role = "student" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} role={role} />

      {/* Right section */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300
        ${isSidebarOpen ? "ml-60" : "ml-20"}`}
      >
        {/* Fixed Navbar */}
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Main content */}
        <main
          className="pt-28 px-6 py-6 flex-1 bg-white dark:bg-[#26283e]
                     text-gray-900 dark:text-white transition-all"
        >
          {/* 🔥 Outlet replaces children */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

