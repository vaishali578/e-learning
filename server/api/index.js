import app from "../app.js";
import connectDB from "../config/db.js";

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("✅ DB connected (Vercel)");
  }

  return app(req, res);
}
