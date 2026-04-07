import socketAuth from "../../middlewares/socketAuth.js";
import Chat from "./chat.model.js";
import registerFriendRequestSocket from "../friendRequest/friendRequest.socket.js";

const onlineUsers = new Map(); // userId => socketId

const registerChatSocket = (io) => {
  // 🔐 Authenticate socket
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const { userId } = socket.user;

    // ➕ Add online user
    onlineUsers.set(userId, socket.id);

    // Optional: emit online status only to friends later
    io.emit("online_users", Array.from(onlineUsers.keys()));

    /* ========================
       💬 CHAT EVENTS
       ======================== */

    /**
     * sender sends a message
     * payload: { receiverId, conversationId, text }
     */
    socket.on("send_message", async ({ receiverId, conversationId, text }) => {

  try {
    if (!receiverId || !text || !conversationId) return;

    const newChat = await Chat.create({
      sender: userId,
      receiver: receiverId,
      conversation: conversationId,
      text,
    });

    // ✅ Populate sender and receiver
    const populatedChat = await newChat.populate([
      { path: "sender", select: "name email profilePhoto" },
      { path: "receiver", select: "name email profilePhoto" },
    ]);

    const receiverSocketId = onlineUsers.get(String(receiverId));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", populatedChat);
    }

    socket.emit("message_sent", populatedChat);
  } catch (err) {
    console.error("❌ Chat send_message error:", err);
    socket.emit("chat_error", err.message);
  }
});



    /**
     * Optional: mark message as seen
     * payload: { chatId }
     */
    socket.on("mark_seen", async ({ chatId }) => {
      try {
        const chat = await Chat.findByIdAndUpdate(
          chatId,
          { seen: true },
          { new: true }
        );

        if (chat) {
          const receiverSocketId = onlineUsers.get(chat.receiver.toString());
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("message_seen", chat);
          }
        }
      } catch (err) {
        console.error("❌ Chat mark_seen error:", err);
      }
    });

    /* ========================
       🤝 FRIEND REQUEST EVENTS
       ======================== */
    registerFriendRequestSocket(socket, io, onlineUsers);

    /* ========================
       ❌ DISCONNECT
       ======================== */
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });
  });
};

export default registerChatSocket;
