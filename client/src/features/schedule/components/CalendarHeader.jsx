import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

const CalendarHeader = ({ currentDate, setCurrentDate }) => {
  
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-800 transition-colors duration-300">

      {/* Left */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {format(currentDate, "MMMM yyyy")}
        </h1>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous week"
            onClick={handlePrev}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            aria-label="Next week"
            onClick={handleNext}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Right */}
      <button
        aria-label="Go to current week" 
        onClick={() => setCurrentDate(new Date())}
        className="px-4 py-2 rounded-lg text-sm font-medium
                   bg-blue-500 text-white hover:bg-blue-600"
      >
        Today
      </button>

    </div>
  );
};

export default CalendarHeader;