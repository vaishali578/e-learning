import React from "react";
import { getUserAvatar } from "@/utils/getUserAvatar";

const FriendRequests = ({ requests = [], onAccept, onReject }) => {
  return (
    <div className="bg-white dark:bg-[#26283e] rounded-xl shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Friend Requests
      </h3>

      <div className="space-y-3">
        {requests.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No pending requests
          </div>
        )}

        {requests.map((r) => {
          const sender = r.sender; // 👈 backend flow

          return (
            <div
              key={r._id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1f2337] transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getUserAvatar(sender?.avatar)}
                  alt={sender?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {sender?.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">
                    0 mutual friends
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                aria-label={`Accept friend request from ${sender?.name}`}
                  onClick={() => onAccept?.(r)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg"
                >
                  Accept
                </button>
                <button
                aria-label={`Reject friend request from ${sender?.name}`}
                  onClick={() => onReject?.(r)}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-[#222436] text-gray-700 dark:text-gray-200 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendRequests;
