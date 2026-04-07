import { NavLink } from "react-router-dom";

const SidebarLink = ({ to, icon, label, isSidebarOpen, isSubItem = false }) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div
          title={!isSidebarOpen ? label : ""}
          className={`flex items-center gap-3 rounded-md cursor-pointer transition-all duration-200
            ${isSubItem ? "px-3 py-1.5 text-sm" : "px-3 py-2"}
            ${
              isActive
                ? isSubItem
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "bg-blue-500 dark:bg-blue-500 text-white border-b-4 border-[#0f5996]"
                : isSubItem
                ? "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
        >
          {/* ICON */}
          {icon && (
            <span
              className={`flex-shrink-0 flex justify-center transition-colors
                ${isSubItem ? "text-base" : "text-xl w-6"}
                ${
                  isActive
                    ? isSubItem
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-white"
                    : isSubItem
                    ? "text-gray-400 dark:text-gray-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
            >
              {icon}
            </span>
          )}

          {/* LABEL */}
          {isSidebarOpen && (
            <span className="whitespace-nowrap flex-1">{label}</span>
          )}

          {/* Active indicator dot for sub-items */}
          {isSubItem && isActive && isSidebarOpen && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0" />
          )}
        </div>
      )}
    </NavLink>
  );
};

export default SidebarLink;