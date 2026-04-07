import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import registerChatSocket from "./modules/chat/chat.socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const ENABLE_SOCKET = process.env.ENABLE_SOCKET === "true";

const server = http.createServer(app);

const startServer = async () => {
  try {
    // 1️⃣ Connect DB
    await connectDB();
    console.log("✅ Database connected");

    // 2️⃣ Socket.io (only when enabled)
    if (ENABLE_SOCKET) {
      console.log("🟢 Socket.io enabled");

      const io = new Server(server, {
        cors: {
          origin: [
            "http://localhost:4173",
            "http://localhost:5173",
            "https://mern-globus-e-learning.vercel.app",
          ],
          methods: ["GET", "POST"],
        },
      });

      registerChatSocket(io);
    } else {
      console.log("🟡 Socket.io disabled");
    }

    // 3️⃣ ALWAYS listen (Render requires this)
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start", error);
    process.exit(1);
  }
};

startServer();
