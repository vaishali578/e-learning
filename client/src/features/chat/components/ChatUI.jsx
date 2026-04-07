import React, { useEffect, useRef, useState } from 'react';
import { getUserAvatar } from '@/utils/getUserAvatar';

const ChatUI = ({ selectedFriend, messages = [], onSend }) => {
  const [text, setText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedFriend]);

  if (!selectedFriend) {
    return (
      <div className="bg-white dark:bg-[#1f2337] rounded-xl shadow-sm  h-210 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">Select a friend to start chatting</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-100 dark:border-[#151827] p-4 flex items-center gap-3">
        <img src={getUserAvatar(selectedFriend.avatar)} alt={selectedFriend.name} className="w-10 h-10 rounded-full" />
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{selectedFriend.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{selectedFriend.status || 'Active'}</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 space-y-3 overflow-auto bg-white dark:bg-[#0b0d17]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-3 py-2 rounded-lg ${m.fromMe ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-[#11121a] text-gray-900 dark:text-gray-100'}`}>
              <div className="text-sm">{m.text}</div>
              <div className="text-[10px] text-gray-400 mt-1 text-right">{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-[#151827] bg-white dark:bg-[#0b0d17]">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message ${selectedFriend.name}...`}
            className="flex-1 px-3 py-2 rounded-md bg-gray-50 dark:bg-[#0f1220] border border-gray-200 dark:border-[#11121a] text-sm text-gray-800 dark:text-gray-100"
          />
          <button
          aria-label="Send Message"
            onClick={() => {
              if (!text.trim()) return;
              onSend?.(text.trim());
              setText('');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
