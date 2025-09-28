import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ChatHeader({ contract }) {
  const { profile } = useAuth();

  // Determine who the "other user" is
  const otherUser = contract.client.id === profile.id ? contract.freelancer : contract.client;

  return (
    <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={otherUser.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${otherUser.full_name}`}
          alt={otherUser.full_name}
          className="h-10 w-10 rounded-full bg-neutral-700"
        />
        <div>
          <p className="font-bold text-white">{otherUser.full_name}</p>
          <p className="text-xs text-neutral-400">{contract.project.title}</p>
        </div>
      </div>
      <span className="text-xs font-semibold uppercase bg-neutral-800 text-neutral-300 px-2 py-1 rounded">
        {contract.status}
      </span>
    </div>
  );
}