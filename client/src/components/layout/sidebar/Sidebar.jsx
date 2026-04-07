import { useState, useEffect, useRef } from "react";
import { useLocation, NavLink } from "react-router-dom";
import * as Icons from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
import { getUserRole } from "@/utils/getUser";
import "./sidebar.css"; // sidebar styles

// ─── Config ────────────────────────────────────────────────────────────────────
const sidebarConfig = {
  student: [
    {
      section: "Core",
      icon: "FiGrid",
      items: [
        { to: "/student/dashboard",     label: "Dashboard",       icon: "FiGrid"        },
        { to: "/student/my-courses",    label: "My Courses",      icon: "FiBookOpen"    },
        { to: "/student/assignments",   label: "Assignments",     icon: "FiClipboard"   },
        { to: "/student/quizzes",       label: "Quizzes & Tests", icon: "FiCheckSquare" },
        { to: "/student/schedule",      label: "Schedule",        icon: "FiCalendar"    },
        { to: "/student/live-classes",  label: "Live Classes",    icon: "FiVideo"       },
      ],
    },
    {
      section: "Learning",
      icon: "FiTrendingUp",
      items: [
        { to: "/student/progress",      label: "Learning Progress", icon: "FiTrendingUp"  },
        { to: "/student/certificates",  label: "Certificates",      icon: "FiAward"       },
      ],
    },
    {
      section: "Communication",
      icon: "FiMessageSquare",
      items: [
        { to: "/student/chat",           label: "Messages",      icon: "FiMessageSquare" },
        { to: "/student/find-people",    label: "Find People",   icon: "FiUsers"         },
        { to: "/student/announcements",  label: "Announcements", icon: "FiBell"          },
      ],
    },
    {
      section: "Discover",
      icon: "FiCompass",
      items: [
        { to: "/student/explore-courses", label: "Explore Courses", icon: "FiSearch" },
        { to: "/student/wishlist",         label: "Wishlist",        icon: "FiHeart"  },
      ],
    },
    {
      section: "Account",
      icon: "FiUser",
      items: [
        { to: "/student/profile",  label: "Profile",       icon: "FiUser"       },
        { to: "/student/settings", label: "Settings",      icon: "FiSettings"   },
        { to: "/student/help",     label: "Help & Support", icon: "FiHelpCircle" },
      ],
    },
  ],

  trainer: [
    {
      section: "Core",
      icon: "FiGrid",
      items: [
        { to: "/trainer/dashboard",    label: "Dashboard",       icon: "FiGrid"        },
        { to: "/trainer/my-courses",   label: "My Courses",      icon: "FiBookOpen"    },
        { to: "/trainer/assignments",  label: "Assignments",     icon: "FiClipboard"   },
        { to: "/trainer/quizzes",      label: "Quizzes & Tests", icon: "FiCheckSquare" },
        { to: "/trainer/schedule",     label: "Schedule",        icon: "FiCalendar"    },
        { to: "/trainer/live-classes", label: "Live Classes",    icon: "FiVideo"       },
      ],
    },
    {
      section: "Learning",
      icon: "FiTrendingUp",
      items: [
        { to: "/trainer/progress",     label: "Student Progress", icon: "FiTrendingUp"  },
        { to: "/trainer/certificates", label: "Certificates",     icon: "FiAward"       },
      ],
    },
    {
      section: "Communication",
      icon: "FiMessageSquare",
      items: [
        { to: "/trainer/chat",          label: "Messages",      icon: "FiMessageSquare" },
        { to: "/trainer/find-people",   label: "Find People",   icon: "FiUsers"         },
        { to: "/trainer/announcements", label: "Announcements", icon: "FiBell"          },
      ],
    },
    {
      section: "Analytics & Revenue",
      icon: "FiActivity",
      items: [
        { to: "/trainer/analytics", label: "Analytics", icon: "FiActivity"    },
        { to: "/trainer/revenue",   label: "Revenue",   icon: "FiDollarSign"  },
      ],
    },
    {
      section: "Account",
      icon: "FiUser",
      items: [
        { to: "/trainer/profile",  label: "Profile",       icon: "FiUser"       },
        { to: "/trainer/settings", label: "Settings",      icon: "FiSettings"   },
        { to: "/trainer/help",     label: "Help & Support", icon: "FiHelpCircle" },
      ],
    },
  ],
};

// ─── Collapsed Icon Button with CSS tooltip ─────────────────────────────────
const CollapsedItem = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + "/");
  const Icon = icon;
  const [hovered, setHovered] = useState(false);
  const [tooltipY, setTooltipY] = useState(0);
  const iconRef = useRef(null);

  const handleMouseEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      // Centre tooltip vertically on the icon
      setTooltipY(rect.top + rect.height / 2);
    }
    setHovered(true);
  };

  return (
    <NavLink
      to={to}
      className="sidebar-collapsed-link"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        ref={iconRef}
        className={`sidebar-collapsed-icon ${isActive ? "active" : ""}`}
      >
        {Icon && <Icon />}
        {isActive && <span className="sidebar-active-pip" />}
      </span>

      {/* Modern floating tooltip */}
      {hovered && (
        <div
          className="sidebar-tooltip"
          style={{ top: tooltipY, transform: "translateY(-50%)" }}
        >
          <span className="sidebar-tooltip-arrow" />
          <span className="sidebar-tooltip-body">
            {Icon && (
              <span className="sidebar-tooltip-icon">
                <Icon />
              </span>
            )}
            {label}
          </span>
        </div>
      )}
    </NavLink>
  );
};

// ─── Open Section with smooth accordion ────────────────────────────────────
const SidebarSection = ({ section, isSidebarOpen }) => {
  const location = useLocation();
  const SectionIcon = Icons[section.icon];

  const hasActiveChild = section.items.some(
    (item) => location.pathname === item.to || location.pathname.startsWith(item.to + "/")
  );

  const [expanded, setExpanded] = useState(hasActiveChild);
  const contentRef = useRef(null);

  useEffect(() => {
    if (hasActiveChild) setExpanded(true);
  }, [location.pathname, hasActiveChild]);

  if (!isSidebarOpen) {
    return (
      <div className="sidebar-collapsed-group">
        {section.items.map((item) => {
          const Icon = Icons[item.icon];
          return (
            <CollapsedItem
              key={item.to}
              to={item.to}
              icon={Icon}
              label={item.label}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="sidebar-section">
      {/* Section header */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className={`sidebar-section-header ${hasActiveChild ? "has-active" : ""}`}
      >
        <span className={`sidebar-section-icon ${hasActiveChild ? "active" : ""}`}>
          {SectionIcon && <SectionIcon />}
        </span>
        <span className="sidebar-section-label">{section.section}</span>
        <span className={`sidebar-chevron ${expanded ? "open" : ""}`}>
          <FiChevronDown size={14} />
        </span>
      </button>

      {/* Accordion body */}
      <div
        ref={contentRef}
        className="sidebar-accordion"
        style={{
          maxHeight: expanded ? `${section.items.length * 44}px` : "0px",
        }}
      >
        <div className="sidebar-subitems">
          {section.items.map((item) => {
            const Icon = Icons[item.icon];
            return (
              <NavLink key={item.to} to={item.to} className="sidebar-sublink">
                {({ isActive }) => (
                  <>
                    <span className={`sidebar-sublink-icon ${isActive ? "active" : ""}`}>
                      {Icon && <Icon />}
                    </span>
                    <span className="sidebar-sublink-label">{item.label}</span>
                    {isActive && <span className="sidebar-sublink-dot" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Main Sidebar ────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen }) => {
  const role = getUserRole();
  const links = sidebarConfig[role] || sidebarConfig["student"];

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : "sidebar--collapsed"}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        {isOpen ? (
          <div className="sidebar-logo-full">
            <span className="sidebar-logo-icon-wrap">GE</span>
            <span className="sidebar-logo-text">Globus E-Learning</span>
          </div>
        ) : (
          <span className="sidebar-logo-pill">GE</span>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {links.map((section, idx) => (
          <SidebarSection
            key={idx}
            section={section}
            isSidebarOpen={isOpen}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
