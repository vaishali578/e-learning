import { format, addDays, startOfWeek } from "date-fns";
import TimeColumn from "./TimeColumn";
import CalendarEventCard from "./CalendarEventCard";

const WeekView = ({ currentDate }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  const days = [...Array(7)].map((_, i) =>
    addDays(weekStart, i)
  );

  // Dummy Events (Replace from backend later)
  const events = [
    {
      id: 1,
      title: "Client Feedback Review",
      dayIndex: 1,
      top: 150,
      height: 120,
      color: "bg-blue-300"
    },
    {
      id: 2,
      title: "Performance Review",
      dayIndex: 0,
      top: 80,
      height: 90,
      color: "bg-purple-300"
    }
  ];

  return (
    <div className="flex border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 rounded-xl overflow-hidden">

      <TimeColumn />

      {/* Days */}
      <div className="grid grid-cols-7 flex-1 relative">

        {days.map((day, index) => (
          <div
            key={index}
            className="border-l border-gray-200 dark:border-gray-700
                       min-h-[1200px] relative"
          >
            {/* Day Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 
                            border-b border-gray-200 dark:border-gray-700
                            text-center py-2 text-sm font-medium">
              <p className="text-gray-500 dark:text-gray-400">
                {format(day, "EEE")}
              </p>
              <p className="text-gray-900 dark:text-white">
                {format(day, "d")}
              </p>
            </div>

            {/* Render Events */}
            {events
              .filter((e) => e.dayIndex === index)
              .map((event) => (
                <CalendarEventCard key={event.id} {...event} />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;