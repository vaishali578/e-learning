import React from "react";
import { getUserAvatar } from "@/utils/getUserAvatar";

const FriendList = ({ friends = [], onSelect }) => {
  return (
    <div className="bg-gray-100 h-210 dark:bg-[#1f2337] rounded-xl shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Friends
      </h3>

      <div className="space-y-3 overflow-auto" style={{ maxHeight: "60vh" }}>
        {friends.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No friends yet
          </div>
        )}

        {friends.map((f) => (
          <button
          aria-label={`Select friend ${f.name}`}
            key={f._id}
            onClick={() => onSelect?.(f)}
            className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1f2337] transition"
          >
            <img
              src={getUserAvatar(f.profilePhoto)}
              alt={f.name}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {f.name}
                </div>

                {f.unreadCount > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {f.unreadCount}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-300 truncate">
                {f.lastMessage || "Say hi!"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FriendList;
