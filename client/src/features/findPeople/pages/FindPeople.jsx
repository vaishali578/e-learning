import React, { useEffect, useState } from "react";
import FriendRequests from "@/features/findPeople/components/FriendRequests";
import { getUsers, syncFriends } from "../services/findPeopleServices";
import { getUserAvatar } from "@/utils/getUserAvatar";

import {
  onFriendRequestReceived,
  onFriendRequestSent,
  onFriendRequestActionDone,
  removeAllListeners,
} from "@/socket/socketListeners";

import { getSocket } from "@/socket/socket";

const FindPeoplePage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===============================
     INITIAL DATA (API = SOURCE OF TRUTH)
  =============================== */
  useEffect(() => {
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const usersResponse = await getUsers();

      // 👇 SAFELY EXTRACT ARRAY
      const users =
        usersResponse?.data?.users ||
        usersResponse?.users ||
        usersResponse?.data ||
        [];

      if (!Array.isArray(users)) {
        console.error("Users is not an array:", users);
        return;
      }

      const { friends, sentRequests, receivedRequests } = await syncFriends();

      const friendIds = friends.map((f) => f._id);
      const sentIds = sentRequests.map((r) => r.receiver._id);

      setIncomingRequests(receivedRequests);

      setAllUsers(
        users.map((user) => {
          let requestStatus = null;

          if (friendIds.includes(user._id)) {
            requestStatus = "accepted";
          } else if (sentIds.includes(user._id)) {
            requestStatus = "pending";
          }

          return {
            ...user,
            avatar: getUserAvatar(user.avatar),
            requestStatus,
          };
        })
      );
    } catch (err) {
      console.error("❌ Initial data load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchInitialData();
}, []);


  /* ===============================
     SOCKET = REALTIME ONLY
  =============================== */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    /* ----- someone sent you request ----- */
    onFriendRequestReceived((request) => {
      setIncomingRequests((prev) => [request, ...prev]);

      setAllUsers((prev) =>
        prev.map((u) =>
          u._id === request.sender ? { ...u, requestStatus: "pending" } : u,
        ),
      );
    });

    /* ----- confirmation to sender ----- */
    onFriendRequestSent((request) => {
      setAllUsers((prev) =>
        prev.map((u) =>
          u._id === request.receiver ? { ...u, requestStatus: "pending" } : u,
        ),
      );
    });

    /* ----- accept / reject done ----- */
    onFriendRequestActionDone((updatedRequest) => {
      setIncomingRequests((prev) =>
        prev.filter((r) => r._id !== updatedRequest._id),
      );

      if (updatedRequest.status === "accepted") {
        setAllUsers((prev) =>
          prev.map((u) =>
            u._id === updatedRequest.sender
              ? { ...u, requestStatus: "accepted" }
              : u,
          ),
        );
      }
    });

    return () => {
      removeAllListeners();
    };
  }, []);

  /* ===============================
     ACTIONS
  =============================== */
  const handleSendRequest = (user) => {
    getSocket()?.emit("send_friend_request", { receiverId: user._id });

    // optimistic UI
    setAllUsers((prev) =>
      prev.map((u) =>
        u._id === user._id ? { ...u, requestStatus: "pending" } : u,
      ),
    );
  };

  const handleAccept = (request) => {
    getSocket()?.emit("update_friend_request", {
      requestId: request._id,
      status: "accepted",
    });
  };

  const handleReject = (request) => {
    getSocket()?.emit("update_friend_request", {
      requestId: request._id,
      status: "rejected",
    });
  };

  /* ===============================
     UI (UNCHANGED)
  =============================== */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Find People
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Connect with other students and expand your network.
        </p>
      </div>

      <div className="bg-white dark:bg-[#26283e] rounded-xl shadow-sm p-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading users...</p>
        ) : (
          <div className="space-y-3">
            {allUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1f2337]"
              >
                <div className="flex items-center gap-3">
                  <img src={user.avatar} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>

                <button
    
                  onClick={() => {
                    if (user.requestStatus === "accepted") {
                    } else if (!user.requestStatus) {
                      handleSendRequest(user);
                    }
                  }}
                  disabled={user.requestStatus === "pending"}
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    user.requestStatus === "pending"
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : user.requestStatus === "accepted"
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white"
                  }`}
                >
                  {user.requestStatus === "pending"
                    ? "Request Sent"
                    : user.requestStatus === "accepted"
                      ? "Send Message"
                      : "Add Friend"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 👇 RECEIVER SIDE */}
      <FriendRequests
        requests={incomingRequests}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
};

export default FindPeoplePage;
