const hours = Array.from({ length: 24 }, (_, i) => i);

const TimeColumn = () => {
  return (
    <div className="w-20 border-r border-gray-200 dark:border-gray-700">

      {hours.map((hour) => (
        <div
          key={hour}
          className="h-16 border-b border-gray-200 dark:border-gray-700
                     text-xs text-gray-500 dark:text-gray-400
                     flex items-start justify-end pr-2 pt-1"
        >
          {hour === 0
            ? "12 AM"
            : hour < 12
            ? `${hour} AM`
            : hour === 12
            ? "12 PM"
            : `${hour - 12} PM`}
        </div>
      ))}

    </div>
  );
};

export default TimeColumn;