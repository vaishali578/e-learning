import { io } from "socket.io-client";

let socket; //singleton socket

export const connectSocket = (token) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token, 
      },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

// Frontend:
// connectSocket(token)
//    ↓
// io("http://backend-url", { auth: { token } })
//    ↓
// Backend receives connection
//    ↓
// JWT verify
//    ↓
// socket.user attached
//    ↓
// connection accepted

