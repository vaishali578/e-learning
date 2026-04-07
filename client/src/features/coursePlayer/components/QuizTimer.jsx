import { useEffect, useState } from "react";

export default function QuizTimer({ timeLimitMinutes = 10, onTimeUp }) {
  const [secondsLeft, setSecondsLeft] = useState(timeLimitMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp(); // call auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="p-2 text-sm font-medium text-white bg-black dark:bg-red-600 rounded w-28 text-center">
      ⏱ {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
}
