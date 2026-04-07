const tabs = ["To Do", "In Progress", "Submit"];

const AssignmentTabs = ({ active, setActive }) => {
  return (
    <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-4 py-3 text-sm font-semibold transition relative
            ${active === tab
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
        >
          {tab}
          {active === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-t" />
          )}
        </button>
      ))}
    </div>
  );
};

export default AssignmentTabs;
