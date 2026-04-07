import { getSocket } from "./socket";

export const sendFriendRequest = (receiverId) => {
  const socket = getSocket();
  socket?.emit("send_friend_request", { receiverId });
};

export const updateFriendRequest = (requestId, status) => {
  const socket = getSocket();
  socket?.emit("update_friend_request", { requestId, status });
};
