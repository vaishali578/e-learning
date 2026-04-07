
import { useEffect } from "react";
import { connectSocket } from "@/socket/socket";

const SocketProvider = ({ token, children }) => {
  useEffect(() => {

    if (token) {
      const socket = connectSocket(token);

      console.log("Socket object:", socket); 

      socket.on("connect", () => {
        console.log("🟢 Socket connected! ID:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected");
      });

      socket.on("connect_error", (err) => {
        console.log("⚠️ Socket connect error:", err.message);
      });
    }
  }, [token]);

  return children;
};

export default SocketProvider;
