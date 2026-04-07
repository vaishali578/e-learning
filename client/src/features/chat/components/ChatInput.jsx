import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);
    setMessage(""); // clear input
  };

  return (
    <div className="p-4 border-t dark:border-gray-700 flex gap-3">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-darkSecondary focus:outline-none"
        placeholder="Type message"
      />
      <button
      aria-label="Send Message"
        onClick={handleSend}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
