import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useApi } from "../../lib/useApi";

export default function ActiveChat({ contractId }) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch the contract details for the header
  const { data: contract, loading: loadingContract } = useApi({
    fetchFn: () =>
      supabase
        .from("contracts")
        .select(
          "*, project:projects(*), client:profiles!contracts_client_id_fkey(*), freelancer:profiles!contracts_freelancer_id_fkey(*)"
        )
        .eq("id", contractId)
        .single(),
    deps: [contractId],
  });

  // Fetch initial messages
  const { data: initialMessages, loading: loadingMessages } = useApi({
    fetchFn: () =>
      supabase
        .from("messages")
        .select("*, sender:profiles(*)")
        .eq("contract_id", contractId)
        .order("created_at"),
    deps: [contractId],
  });

  useEffect(() => {
    if (initialMessages) setMessages(initialMessages);
  }, [initialMessages]);

  // Set up realtime subscription for new messages
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${contractId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `contract_id=eq.${contractId}`,
        },
        async (payload) => {
          // When a new message arrives, fetch its sender details to match the initial fetch structure
          const { data: senderProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", payload.new.sender_id)
            .single();
          const messageWithSender = { ...payload.new, sender: senderProfile };
          setMessages((current) => [...current, messageWithSender]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contractId]);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    await supabase.from("messages").insert([
      {
        contract_id: contractId,
        sender_id: profile.id,
        text: text.trim(),
        message_type: "chat",
      },
    ]);
  };

  const handleSendFile = async (file) => {
    if (!file) return;

    try {
      // 1. Sanitize the filename to make it URL-safe
      const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filePath = `chat-attachments/${contractId}/${Date.now()}-${sanitizedFilename}`;

      // 2. Upload the file to the 'chat-attachments' bucket
      const { error: uploadError } = await supabase.storage
        .from("chat-attachments")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Get the public URL of the uploaded file
      const { data: publicData } = supabase.storage
        .from("chat-attachments")
        .getPublicUrl(filePath);

      // 4. Insert a new message record of type 'file'
      const { error: insertError } = await supabase.from("messages").insert([
        {
          contract_id: contractId,
          sender_id: profile.id,
          file_url: publicData.publicUrl,
          text: file.name, // Store the original filename in the text field for display
          message_type: "file",
        },
      ]);

      if (insertError) throw insertError;
    } catch (error) {
      console.error("Error sending file:", error);
      alert("Error sending file: " + error.message);
    }
  };

  const isLoading = loadingContract || loadingMessages;

  return (
    <div className="h-full flex flex-col bg-neutral-900">
      {isLoading && (
        <div className="p-4 text-center text-neutral-400">Loading Chat...</div>
      )}

      {contract && <ChatHeader contract={contract} />}

      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {contract && (
        <MessageInput
          onSendMessage={handleSendMessage}
          onSendFile={handleSendFile} // Pass the new handler
        />
      )}
    </div>
  );
}
