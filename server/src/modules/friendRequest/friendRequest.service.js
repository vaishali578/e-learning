import mongoose from "mongoose";
import FriendRequest from "./FriendRequest.model.js";

/**
 * Send friend request
 */
export const sendFriendRequestService = async (senderId, receiverId) => {
  // Already request exist check
  const exist = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
  if (exist) throw new Error("Request already sent");

  const request = await FriendRequest.create({ sender: senderId, receiver: receiverId });
  return request;
};

/**
 * Update friend request
 */
export const updateFriendRequestService = async (requestId, status) => {
  if (!["accepted", "rejected"].includes(status)) throw new Error("Invalid status");
  const request = await FriendRequest.findById(requestId);
  if (!request) throw new Error("Request not found");
  request.status = status;
  await request.save();
  return request;
};

/**
 * Get all requests for a user
 */
export const getFriendRequestsService = async (userId) => {
  return await FriendRequest.find({
    $or: [{ sender: userId }, { receiver: userId }]
  }).populate("sender", "name role").populate("receiver", "name role").sort({ createdAt: -1 });
};

export const getPendingFriendRequestsService = async (userId) => {
  return await FriendRequest.find({
    receiver: userId,
    status: "pending"
  })
    .populate("sender", "name role avatar") 
    .sort({ createdAt: -1 });
};

// Pending requests sent by current user
export const getSentPendingFriendRequestsService = async (userId) => {
  return await FriendRequest.find({
    sender: userId,
    status: "pending",
  })
    .select("receiver status")
    .lean();
};

/**
 * Get friends list (accepted requests only)
 */
export const getFriendsListService = async (userId) => {
  const requests = await FriendRequest.find({
    status: "accepted",
    $or: [
      { sender: userId },
      { receiver: userId }
    ]
  })
    .populate("sender", "name role avatar")
    .populate("receiver", "name role avatar")
    .sort({ createdAt: -1 })
    .lean();

  // Ab actual friends nikalte hain
  const friends = requests.map((req) => {
    // Agar current user sender hai → friend = receiver
    if (req.sender._id.toString() === userId.toString()) {
      return req.receiver;
    }
    // Agar current user receiver hai → friend = sender
    return req.sender;
  });

  return friends;
};



export const syncFriendDataService = async (userId) => {

  const userObjectId =
    typeof userId === "string"
      ? new mongoose.Types.ObjectId(userId)
      : userId;

  /* ===============================
     ACCEPTED FRIENDS
  =============================== */
  const friends = await FriendRequest.find({
    status: "accepted",
    $or: [{ sender: userObjectId }, { receiver: userObjectId }],
  }).populate("sender receiver", "name email avatar");


  /* ===============================
     SENT REQUESTS
  =============================== */
  const sentRequests = await FriendRequest.find({
    sender: userObjectId,
    status: "pending",
  }).populate("receiver", "name email avatar");

  /* ===============================
     RECEIVED REQUESTS
  =============================== */
  const receivedRequests = await FriendRequest.find({
    receiver: userObjectId,
    status: "pending",
  }).populate("sender", "name email avatar");

  /* ===============================
     FINAL MAPPED DATA
  =============================== */
  const mappedFriends = friends.map((f) =>
    f.sender._id.toString() === userObjectId.toString()
      ? f.receiver
      : f.sender
  );

  return {
    friends: mappedFriends,
    sentRequests: sentRequests.map((r) => ({
      _id: r._id,
      receiver: r.receiver,
      status: r.status,
    })),
    receivedRequests: receivedRequests.map((r) => ({
      _id: r._id,
      sender: r.sender,
      status: r.status,
    })),
  };
};
