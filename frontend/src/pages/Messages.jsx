import React, { useState } from 'react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import ConversationList from '../components/Chat/ConversationList';
import ActiveChat from '../components/Chat/ActiveChat'; // We will create this next

export default function Messages() {
  const [activeContractId, setActiveContractId] = useState(null);

  return (
    <div className="bg-neutral-950 min-h-screen text-white flex flex-col">
      <LoggedInNavbar />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-theme(space.16))]"> {/* Adjust h-screen minus navbar height */}
        
        {/* Left Panel */}
        <div className="md:col-span-1 lg:col-span-1 h-full">
          <ConversationList
            activeContractId={activeContractId}
            onSelectConversation={setActiveContractId}
          />
        </div>

        {/* Right Panel */}
        <div className="md:col-span-2 lg:col-span-3 h-full border-l border-neutral-800">
          {activeContractId ? (
            <ActiveChat contractId={activeContractId} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-neutral-500">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}