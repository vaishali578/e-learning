import React, { useEffect, useState } from "react";
import FriendList from "@/features/chat/components/FriendList";
import ChatUI from "@/features/chat/components/ChatUI";
import { getSocket } from "@/socket/socket";

// Services
import {
  fetchChatConversationsService,
  getOrCreateConversation,
  loadMessages,
} from "../services/chatServices";

const ChatLayout = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id;

  // 👉 REQUIRED STORES
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);

  // Other state
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);

  /* ===============================
     1️⃣ Load friend list
  =============================== */
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const list = await fetchChatConversationsService();
        setFriends(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("❌ Failed to load friends:", err);
        setFriends([]);
      }
    };

    fetchFriends();
  }, []);

  /* ===============================
     2️⃣ Socket listener
  =============================== */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (msg) => {

  const isActive =
    activeConversationId && msg.conversation === activeConversationId;

  if (isActive) {
    setMessages((prev) => [
      ...prev,
      {
        _id: msg._id,
        text: msg.text,
        fromMe: msg.sender === currentUserId,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }
};


    socket.on("receive_message", handleReceiveMessage);

    return () => socket.off("receive_message", handleReceiveMessage);
  }, [activeConversationId]);

  /* ===============================
     3️⃣ Select friend
  =============================== */
  const handleSelect = async (friend) => {

  setSelectedFriend(friend);

  try {

    const conversation = await getOrCreateConversation(friend._id);

    if (!conversation) {
      console.warn("⚠️ No conversation returned");
      return;
    }

    setActiveConversationId(conversation._id);

    const msgs = await loadMessages(conversation._id);


    const formattedMessages = msgs.map((m) => {
      const fromMe =
        String(m.sender?._id || m.sender) === String(currentUserId);

      return {
        _id: m._id,
        text: m.text,
        fromMe,
        time: new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    setMessages(formattedMessages);

    setFriends((prev) =>
      prev.map((f) =>
        f._id === friend._id ? { ...f, unreadCount: 0 } : f,
      ),
    );

  } catch (err) {
    console.error("❌ Failed to open chat:", err);
  }
};

  /* ===============================
     4️⃣ Send message
  =============================== */
  const handleSend = (text) => {
    if (!selectedFriend || !activeConversationId) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit("send_message", {
      receiverId: selectedFriend._id,
      conversationId: activeConversationId,
      text: text,
    });

    // optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        _id: `temp-${Date.now()}`,

        text,
        fromMe: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setFriends((prev) =>
      prev.map((f) =>
        f._id === selectedFriend._id ? { ...f, lastMessage: text } : f,
      ),
    );
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="h-210 dark:bg-[#26283e] flex">
      {/* LEFT */}
      <aside className="w-96 border-r border-gray-100 dark:border-[#222436]">
        <FriendList friends={friends} onSelect={handleSelect} />
      </aside>

      {/* RIGHT */}
      <main className="flex-1 px-6">
        <div className="bg-gray-100 dark:bg-[#1f2337] rounded-xl p-6 h-full">
          <ChatUI
            selectedFriend={selectedFriend}
            messages={messages}
            onSend={handleSend}
          />
        </div>
      </main>
    </div>
  );
};

export default ChatLayout;
