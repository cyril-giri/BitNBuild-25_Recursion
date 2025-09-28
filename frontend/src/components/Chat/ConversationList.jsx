import React from "react";

import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import ConversationCard from "./ConversationCard";
import { useApi } from "../../lib/useApi";

export default function ConversationList({
  activeContractId,
  onSelectConversation,
}) {
  const { profile } = useAuth();

  const {
    data: conversations,
    loading,
    error,
  } = useApi({
    fetchFn: () => {
      if (!profile) return { data: [], error: null };
      // Call the database function to get all conversations for the current user
      return supabase.rpc("get_user_conversations", { p_user_id: profile.id });
    },
    deps: [profile],
  });

  return (
    <div className="h-full bg-neutral-900 border-r border-neutral-800 flex flex-col">
      <div className="p-4 border-b border-neutral-800">
        <h2 className="text-xl font-bold text-white">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {loading && (
          <p className="text-neutral-400 p-2">Loading conversations...</p>
        )}
        {error && <p className="text-red-500 p-2">Error: {error.message}</p>}
        {conversations?.map((convo) => (
          <ConversationCard
            key={convo.contract_id}
            conversation={convo}
            isActive={convo.contract_id === activeContractId}
            onSelect={() => onSelectConversation(convo.contract_id)}
          />
        ))}
        {!loading && conversations?.length === 0 && (
          <p className="text-neutral-500 text-center p-4">
            You have no active conversations.
          </p>
        )}
      </div>
    </div>
  );
}
