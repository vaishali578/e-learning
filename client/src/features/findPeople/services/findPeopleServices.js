import api from "@/services/api";

/* ===============================
   GET ALL USERS
=============================== */
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get("/users", { params });
    return response.data; // array of users
  } catch (err) {
    console.error("❌ getUsers API error:", err);
    return [];
  }
};

/* ===============================
   SYNC FRIEND DATA SERVICE
=============================== */
export const syncFriends = async () => {
  try {
    const response = await api.get("/friend-requests");

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to sync friend data");
    }

    const { friends, sentRequests, receivedRequests } = response.data.data; // note the extra `.data` from backend response

    // Map IDs for easier lookup in frontend
    const friendIds = friends.map((f) => f._id.toString());
    const sentIds = sentRequests.map((r) => r.receiver._id.toString());
    const receivedIds = receivedRequests.map((r) => r.sender._id.toString());
  

    return { friends, sentRequests, receivedRequests, friendIds, sentIds, receivedIds };
  } catch (err) {
    console.error("❌ syncFriends API error:", err);
    return {
      friends: [],
      sentRequests: [],
      receivedRequests: [],
      friendIds: [],
      sentIds: [],
      receivedIds: [],
    };
  }
};
