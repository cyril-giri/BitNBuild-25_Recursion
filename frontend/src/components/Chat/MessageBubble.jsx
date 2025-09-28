import React from 'react';
import { useAuth } from '../../context/AuthContext';

// Helper to check if a URL points to an image
const isImageUrl = (url) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

export default function MessageBubble({ message }) {
  const { profile } = useAuth();
  const isCurrentUser = message.sender_id === profile.id;
  
  // --- NEW: Handle different message types ---
  let messageContent;
  if (message.message_type === 'system') {
    return (
      <div className="text-center my-2">
        <span className="text-xs text-neutral-500 italic bg-neutral-800/50 px-3 py-1 rounded-full">{message.text}</span>
      </div>
    );
  } else if (message.message_type === 'file') {
    messageContent = (
      <a href={message.file_url} target="_blank" rel="noopener noreferrer" className="block p-2 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors">
        {isImageUrl(message.file_url) ? (
          <img src={message.file_url} alt={message.text} className="max-w-xs max-h-48 rounded-md" />
        ) : (
          <div className="flex items-center gap-2">
            {/* File Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span className="text-sm text-cyan-400 underline">{message.text}</span>
          </div>
        )}
      </a>
    );
  } else {
    // Default is a 'chat' message
    messageContent = <p className="text-sm text-white">{message.text}</p>;
  }


  const sender = message.sender || {};
  const alignment = isCurrentUser ? 'justify-end' : 'justify-start';
  const bubbleColor = isCurrentUser ? 'bg-cyan-800' : 'bg-neutral-800';

  return (
    <div className={`flex ${alignment} my-1`}>
      <div className="flex items-start gap-2 max-w-md">
        {!isCurrentUser && (
          <img src={sender.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${sender.full_name}`} alt={sender.full_name} className="h-8 w-8 rounded-full bg-neutral-700 mt-1" />
        )}
        <div className={`p-3 rounded-lg ${bubbleColor}`}>
          {!isCurrentUser && <p className="text-xs font-bold text-cyan-400 mb-1">{sender.full_name}</p>}
          {messageContent}
          <p className="text-xs text-neutral-400 text-right mt-1">{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    </div>
  );
}