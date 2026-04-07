import jwt from "jsonwebtoken";

const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = {
      userId: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(new Error("Invalid socket token"));
  }
};

export default socketAuth;

// Client connects
//    ↓
// Token send
//    ↓
// socketAuth
//    ↓
// Valid? ── yes ─→ connect
//    │
//    no
//    ↓
// reject

