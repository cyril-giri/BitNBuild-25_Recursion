import React, { useState, useEffect } from 'react';
import ConversationList from './ConversationList';
import ActiveChat from './ActiveChat';

export default function ChatInterface({ initialContractId = null }) {
  const [activeContractId, setActiveContractId] = useState(initialContractId);

  // If the initialContractId prop changes (e.g., navigating between contracts),
  // update the active chat window.
  useEffect(() => {
    setActiveContractId(initialContractId);
  }, [initialContractId]);

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full">
      {/* Left Panel: Conversation List */}
      <div className="md:col-span-1 lg:col-span-1 h-full border-r border-neutral-800">
        <ConversationList
          activeContractId={activeContractId}
          onSelectConversation={setActiveContractId}
        />
      </div>

      {/* Right Panel: Active Chat Window */}
      <div className="hidden md:block md:col-span-2 lg:col-span-3 h-full">
        {activeContractId ? (
          <ActiveChat contractId={activeContractId} key={activeContractId} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-neutral-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}