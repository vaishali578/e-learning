const CalendarEventCard = ({ title, top, height, color }) => {
  return (
    <div
      className={`absolute left-1 right-1 rounded-lg text-xs p-2 shadow
                  text-gray-900 dark:text-gray-900 ${color}`}
      style={{
        top: `${top}px`,
        height: `${height}px`
      }}
    >
      <p className="font-semibold truncate">
        {title}
      </p>
    </div>
  );
};

export default CalendarEventCard;