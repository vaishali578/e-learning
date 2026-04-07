import { getMessageFriendListService, getOrCreateConversationService, fetchChatsService} from "./chat.service.js";

/**
 * GET /api/chats/:conversationId
 * Fetch all chats for a conversation
 */
export const fetchChatsController = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const chats = await fetchChatsService(conversationId);

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (err) {
    console.error("❌ fetchChatsController error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
};


export const getMessageFriendListController = async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await getMessageFriendListService(userId);

    return res.status(200).json({
      success: true,
      data: friends,
    });
  } catch (error) {
    console.error("❌ Message Friend List Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load conversations",   
    });
  }
};

/**
 * Controller to get or create conversation between logged-in user & selected user
 */
export const getOrCreateConversationController = async (req, res) => {
  try {
    const myId = req.user.id;
    const friendId = req.params.friendId; 

    const conversation = await getOrCreateConversationService(myId, friendId);

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (err) {
    console.error("❌ getOrCreateConversation error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to get or create conversation",
    });
  }
};


