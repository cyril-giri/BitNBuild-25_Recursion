import React from 'react';

export default function ConversationCard({ conversation, isActive, onSelect }) {
  const {
    other_user_full_name,
    other_user_avatar_url,
    last_message_text,
    last_message_created_at,
    is_unread
  } = conversation;

  const timeSince = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return "now";
  };

  return (
    <div
      onClick={onSelect}
      className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors ${
        isActive ? 'bg-cyan-900/50' : 'hover:bg-neutral-800/50'
      }`}
    >
      <div className="relative">
        <img
          src={other_user_avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${other_user_full_name}`}
          alt={other_user_full_name}
          className="h-12 w-12 rounded-full bg-neutral-700"
        />
        {is_unread && (
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-cyan-400 border-2 border-neutral-900"></span>
        )}
      </div>
      <div className="flex-1 ml-4 overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="font-bold text-white truncate">{other_user_full_name}</p>
          <p className="text-xs text-neutral-400 flex-shrink-0">{timeSince(last_message_created_at)}</p>
        </div>
        <p className="text-sm text-neutral-400 truncate">{last_message_text || 'No messages yet'}</p>
      </div>
    </div>
  );
}