import { getSocket } from "./socket";

/* =========================
   SEND MESSAGE
========================= */
export const sendMessage = ({ receiverId, conversationId, text }) => {
  const socket = getSocket();
  if (!socket) return;

  socket.emit("send_message", {
    receiverId,
    conversationId, // mandatory now
    text,           // renamed from 'message' to match backend
  });
};

/* =========================
   MARK MESSAGE SEEN
========================= */
export const markMessageSeen = (chatId) => {
  const socket = getSocket();
  if (!socket) return;

  socket.emit("mark_seen", { chatId });
};

/* =========================
   TYPING INDICATOR (optional)
========================= */
export const sendTypingStatus = ({ conversationId, isTyping }) => {
  const socket = getSocket();
  if (!socket) return;

  socket.emit("typing", { conversationId, isTyping });
};
