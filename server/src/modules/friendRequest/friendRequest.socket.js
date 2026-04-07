import {
  getPendingFriendRequestsService,
  getSentPendingFriendRequestsService,
  sendFriendRequestService,
  updateFriendRequestService,
  getFriendsListService,
} from "./friendRequest.service.js";

const registerFriendRequestSocket = async (socket, io, onlineUsers) => {
  const { userId } = socket.user;

  console.log("🤝 FriendRequest socket registered:", userId);

  /* =====================================================
   1️⃣ INITIAL DATA (DB REAL DATA)
===================================================== */
  try {
    const pendingReceived = await getPendingFriendRequestsService(userId);
    socket.emit("pending_friend_requests", pendingReceived);

    const pendingSent = await getSentPendingFriendRequestsService(userId);
    socket.emit("sent_friend_requests", pendingSent);

    // 🔹 NEW: Friends list
    const friends = await getFriendsListService(userId);
    socket.emit("friends_list", friends);
  } catch (err) {
    console.error("❌ Friend init error:", err);
  }

  /* =====================================================
     2️⃣ SEND FRIEND REQUEST
  ===================================================== */
  socket.on("send_friend_request", async ({ receiverId }) => {
    try {
      const request = await sendFriendRequestService(userId, receiverId);

      // 🔹 Notify receiver
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("friend_request_received", request);
      }

      // 🔹 Notify sender
      socket.emit("friend_request_sent", request);
    } catch (err) {
      socket.emit("friend_request_error", err.message);
    }
  });

  /* =====================================================
     3️⃣ ACCEPT / REJECT FRIEND REQUEST
  ===================================================== */
  socket.on("update_friend_request", async ({ requestId, status }) => {
    try {
      const updated = await updateFriendRequestService(requestId, status);

      // 🔹 Notify sender
      const senderSocketId = onlineUsers.get(updated.sender.toString());
      if (senderSocketId) {
        io.to(senderSocketId).emit("friend_request_updated", updated);
      }

      // 🔹 Notify receiver (current user)
      socket.emit("friend_request_action_done", updated);

      // 🔹 NEW: if accepted, notify both users to enable "Send Message" button
      if (status === "accepted") {
        const senderSocket = onlineUsers.get(updated.sender.toString());
        const receiverSocket = onlineUsers.get(updated.receiver.toString());

        const payload = {
          friendId: updated.sender.toString(), // for receiver
          friendName: updated.senderName, // optional: send name/email
        };

        // Notify receiver
        if (receiverSocket)
          io.to(receiverSocket).emit("friend_request_accepted", payload);

        // Notify sender
        const senderPayload = {
          friendId: updated.receiver.toString(), // for sender
          friendName: updated.receiverName, // optional
        };
        if (senderSocket)
          io.to(senderSocket).emit("friend_request_accepted", senderPayload);
      }
    } catch (err) {
      socket.emit("friend_request_error", err.message);
    }
  });
};

export default registerFriendRequestSocket;
