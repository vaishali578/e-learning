const CalendarViewToggle = ({ view, setView }) => {

  const views = ["day", "week", "month"];

  return (
    <div className="inline-flex rounded-xl bg-gray-200 dark:bg-gray-700 p-1">

      {views.map((v) => (
        <button
          aria-label={`Switch to ${v} view`}
          key={v}
          onClick={() => setView(v)}
          className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all
            ${
              view === v
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow"
                : "text-gray-600 dark:text-gray-300"
            }`}
        >
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </button>
      ))}

    </div>
  );
};

export default CalendarViewToggle;