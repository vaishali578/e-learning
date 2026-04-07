
import mongoose from "mongoose";
import Conversation from "./conversation.model.js";
import FriendRequest from "../friendRequest/FriendRequest.model.js";
import Chat from "./chat.model.js";

/**
 * Fetch chats for a conversation
 * @param {ObjectId} conversationId
 */
export const fetchChatsService = async (conversationId) => {
  const chats = await Chat.find({ conversation: conversationId })
    .populate("sender", "name email profilePhoto")
    .populate("receiver", "name email profilePhoto")
    .sort({ createdAt: 1 }); // oldest first

  return chats;
};

export const getMessageFriendListService = async (userId) => {

  const userObjectId =
    typeof userId === "string"
      ? new mongoose.Types.ObjectId(userId)
      : userId;

  // ✅ Only accepted friends
  const friends = await FriendRequest.find({
    status: "accepted",
    $or: [{ sender: userObjectId }, { receiver: userObjectId }],
  }).populate("sender receiver", "name email profilePhoto");

  // 🎯 Map actual friend (not current user)
  const mappedFriends = friends.map((f) => {
    const isSender = f.sender._id.toString() === userObjectId.toString();
    const friendUser = isSender ? f.receiver : f.sender;

    const friendObj = {
      _id: friendUser._id,
      name: friendUser.name,
      email: friendUser.email,
      profilePhoto: friendUser.profilePhoto,

      // 🔮 future ready fields
      lastMessage: null,
      lastMessageAt: null,
      unreadCount: 0,
      isOnline: false,
    };

    return friendObj;
  });


  return mappedFriends;
};



/**
 * Service to get or create conversation between two users
 */
export const getOrCreateConversationService = async (myId, friendId) => {
  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    throw new Error("Invalid user id");
  }

  // 🧠 Find existing conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [myId, friendId] },
  }).populate("participants", "name email profilePhoto");

  // ✅ Return if exists
  if (conversation) return conversation;

  // ❌ Else create new
  conversation = await Conversation.create({
    participants: [myId, friendId],
  });

  // Populate newly created conversation
  const populatedConversation = await Conversation.findById(conversation._id)
    .populate("participants", "name email profilePhoto");

  return populatedConversation;
};
