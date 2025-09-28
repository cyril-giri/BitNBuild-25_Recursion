import React, { useState, useRef } from 'react';

// The component now accepts an onSendFile prop
export default function MessageInput({ onSendMessage, onSendFile }) {
  const [text, setText] = useState('');
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleAttachmentClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSendFile(file);
    }
  };

  return (
    <div className="p-4 border-t border-neutral-800">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        {/* Attachment button */}
        <button type="button" onClick={handleAttachmentClick} className="text-neutral-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />

        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-sm text-white focus:ring-cyan-500 focus:border-cyan-500"
        />
        <button 
          type="submit"
          className="bg-cyan-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}