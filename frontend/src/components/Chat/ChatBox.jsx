import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useApi } from '../../lib/useApi';

export default function ChatBox({ contractId, currentUserProfile }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Fetch initial messages when the component mounts
  const { data: initialMessages } = useApi({
    fetchFn: () => supabase
      .from('messages')
      .select('*, sender:profiles(*)')
      .eq('contract_id', contractId)
      .order('created_at'),
    deps: [contractId]
  });

  useEffect(() => {
    if (initialMessages) setMessages(initialMessages);
  }, [initialMessages]);

  // Set up Supabase Realtime subscription for new messages
  useEffect(() => {
    const channel = supabase.channel(`chat:${contractId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `contract_id=eq.${contractId}` },
        async (payload) => {
          // When a new message arrives, we need to fetch its sender details
          // This ensures newly arrived messages have the same data structure as the initial ones
          const { data: senderProfile } = await supabase.from('profiles').select('*').eq('id', payload.new.sender_id).single();
          const messageWithSender = { ...payload.new, sender: senderProfile };
          setMessages((currentMessages) => [...currentMessages, messageWithSender]);
        })
      .subscribe();

    // Cleanup function to remove the subscription when the component unmounts
    return () => { supabase.removeChannel(channel); };
  }, [contractId]);
  
  // Automatically scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    await supabase.from('messages').insert([{
      contract_id: contractId,
      sender_id: currentUserProfile.id,
      text: newMessage.trim(),
    }]);
    setNewMessage('');
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg h-[80vh] flex flex-col">
      <div className="p-4 border-b border-neutral-800">
        <h3 className="font-bold text-white">Project Chat</h3>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.sender_id === currentUserProfile.id ? 'items-end' : 'items-start'}`}>
            <p className="text-xs text-neutral-400">{msg.sender?.full_name || 'System'}</p>
            <p className={`max-w-xs text-sm p-2 rounded-lg mt-1 ${msg.sender_id === currentUserProfile.id ? 'bg-cyan-800' : 'bg-neutral-800'}`}>
              {msg.text}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-800">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-sm text-white"
        />
      </form>
    </div>
  );
}