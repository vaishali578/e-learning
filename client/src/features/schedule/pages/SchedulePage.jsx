import { useState } from "react";
import CalendarHeader from "../components/CalendarHeader";
import CalendarViewToggle from "../components/CalendarViewToggle";
import WeekView from "../components/WeekView";

const SchedulePage = () => {
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Header */}
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />

      {/* View Toggle */}
      <div className="px-6 pt-4">
        <CalendarViewToggle view={view} setView={setView} />
      </div>

      {/* Calendar Body */}
      <div className="mt-4 px-6 pb-10">
        {view === "week" && <WeekView currentDate={currentDate} />}
      </div>

    </div>
  );
};

export default SchedulePage;