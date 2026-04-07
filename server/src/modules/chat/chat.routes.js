import express from "express";
import {
  fetchChatsController,
  getOrCreateConversationController,
  getMessageFriendListController,
} from "./chat.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Friend list
router.get("/conversations", protect, getMessageFriendListController);

// Get or create conversation with a friend
router.get(
  "/conversations/:friendId",
  protect,
  getOrCreateConversationController,
);

// Fetch chats for a conversation
router.get("/:conversationId", protect, fetchChatsController);

export default router;
