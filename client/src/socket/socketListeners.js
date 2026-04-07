import { getSocket } from "./socket";

/* =========================
   CHAT
========================= */
export const onReceiveMessage = (cb) => {
  getSocket()?.on("receive_message", cb);
};

export const onMessageSent = (cb) => {
  getSocket()?.on("message_sent", cb);
};

/* =========================
   FRIEND REQUESTS
========================= */

// 🔹 Receiver side (initial pending list)
export const onPendingFriendRequests = (cb) => {
  getSocket()?.on("pending_friend_requests", cb);
};

// 🔹 Sender side (initial sent list)
export const onSentFriendRequests = (cb) => {
  getSocket()?.on("sent_friend_requests", cb);
};

// 🔹 Real-time receive
export const onFriendRequestReceived = (cb) => {
  getSocket()?.on("friend_request_received", cb);
};

// 🔹 Sender confirmation
export const onFriendRequestSent = (cb) => {
  getSocket()?.on("friend_request_sent", cb);
};

// 🔹 Request accepted/rejected (both sides)
export const onFriendRequestActionDone = (cb) => {
  getSocket()?.on("friend_request_action_done", cb);
};

// 🔹 Optional: specific listener when request is accepted
export const onFriendRequestAccepted = (cb) => {
  getSocket()?.on("friend_request_accepted", cb);
};

// 🔹 Optional: specific listener when request is rejected
export const onFriendRequestRejected = (cb) => {
  getSocket()?.on("friend_request_rejected", cb);
};

/* =========================
   ONLINE USERS
========================= */
export const onOnlineUsers = (cb) => {
  getSocket()?.on("online_users", cb);
};

/* =========================
   FRIENDS
========================= */
export const onFriendsList = (cb) => {
  getSocket()?.on("friends_list", cb);
};



/* =========================
   CLEANUP (VERY IMPORTANT)
========================= */
export const removeAllListeners = () => {
  const socket = getSocket();
  if (!socket) return;

  // Chat
  socket.off("receive_message");
  socket.off("message_sent");

  // Friend requests
  socket.off("pending_friend_requests");
  socket.off("sent_friend_requests");
  socket.off("friend_request_received");
  socket.off("friend_request_sent");
  socket.off("friend_request_updated");
  socket.off("friend_request_action_done");
  socket.off("friend_request_accepted");
  socket.off("friend_request_rejected");

  // Online users
  socket.off("online_users");

  // Friends
socket.off("friends_list");
};
