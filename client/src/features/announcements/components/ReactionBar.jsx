import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

const ReactionBar = () => {
  return (
    <div className="flex justify-between text-gray-400 text-sm mt-4">
      <div className="flex gap-6">
        <button aria-label="ThumpsUp" className="flex items-center gap-2 hover:text-white">
          <ThumbsUp size={16} /> React
        </button>
        <button aria-label="Comment" className="flex items-center gap-2 hover:text-white">
          <MessageCircle size={16} /> Comment
        </button>
        <button aria-label="Share" className="flex items-center gap-2 hover:text-white">
          <Share2 size={16} /> Share
        </button>
      </div>

      <span className="hover:text-white cursor-pointer">View Full Post</span>
    </div>
  );
};

export default ReactionBar;
