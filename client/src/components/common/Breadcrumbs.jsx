import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();

  // "/student/my-courses" → ["student", "my-courses"]
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x);

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
      {pathnames.map((name, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;

        const label = name
          .replace("-", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <span key={routeTo} className="flex items-center gap-2">
            {!isLast ? (
              <Link
                to={routeTo}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                {label}
              </Link>
            ) : (
              <span className="text-gray-700 dark:text-gray-300">
                {label}
              </span>
            )}

            {!isLast && <span>/</span>}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
