import api from "@/services/api";

/* ===============================
   GET MESSAGE PAGE FRIEND LIST
   GET /api/chats/conversations
================================ */
export const fetchChatConversationsService = async () => {
  try {
    const response = await api.get("/chats/conversations");

    // response.data = { success, data }
    if (!response.data || !response.data.data) {
      console.warn("⚠️ API returned unexpected format:", response.data);
      return [];
    }

    return response.data.data; // ✅ only the array
  } catch (error) {
    console.error("❌ Fetch Conversations Error:", error);
    throw error;
  }
};

/* ===============================
   GET OR CREATE CONVERSATION
   GET /api/chats/conversations/:friendId
================================ */
export const getOrCreateConversation = async (friendId) => {
  try {
    const res = await api.get(`/chats/conversations/${friendId}`);


    return res.data.data; // conversation object with participants
  } catch (err) {
    console.error("❌ Failed to get or create conversation:", err);
    return null;
  }
};

/* ===============================
   LOAD MESSAGES
   GET /api/chats/:conversationId
================================ */
export const loadMessages = async (conversationId) => {
  try {
    const res = await api.get(`/chats/${conversationId}`);

    return res.data.data; // array of message objects
  } catch (err) {
    console.error("❌ Failed to load messages:", err);
    return [];
  }
};
