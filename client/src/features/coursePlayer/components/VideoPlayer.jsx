import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { markItemComplete } from "@/features/progress/services/progressService";

export default function VideoPlayer({ videoUrl, lesson, onProgressUpdate }) {
  const videoRef = useRef(null);
  const { courseId } = useParams();

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  // ▶️ Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // ⏱️ Update progress
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);
  };

  // 🎬 Handle video ended - mark lesson as complete
  const handleVideoEnded = async () => {
    setIsPlaying(false);

    if (!lessonCompleted && lesson?._id && courseId) {
      try {
        await markItemComplete({
          courseId,
          itemId: lesson._id,
          itemType: "lesson",
        });

        setLessonCompleted(true);

        // Notify parent to refresh progress
        if (onProgressUpdate) {
          onProgressUpdate();
        }
      } catch (error) {
        console.error("Error marking lesson as complete:", error);
      }
    }
  };

  // 🎯 Seek video
  const handleSeek = (e) => {
    if (!videoRef.current || !videoRef.current.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    const newTime =
      (clickX / width) * videoRef.current.duration;

    videoRef.current.currentTime = newTime;
  };

  return (
    <div className="p-6 bg-white dark:bg-[#26283e]">
      <div className="bg-black dark:bg-black rounded-lg flex flex-col">

        {/* VIDEO */}
        <div className="relative w-full h-[360px] bg-black rounded-t-lg">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
          />

          {/* Play/Pause Overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause size={80} className="text-white opacity-70" />
            ) : (
              <Play size={80} className="text-white opacity-70" />
            )}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="p-4 bg-black/80 rounded-b-lg">
          {/* Progress Bar */}
          <div
            className="w-full h-2 bg-gray-700 rounded cursor-pointer mb-2"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-red-500 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Play/Pause Button */}
          <div className="flex justify-end">
            <button aria-label={isPlaying ? "Pause Video" : "Play Video"} onClick={togglePlay} className="text-white">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}