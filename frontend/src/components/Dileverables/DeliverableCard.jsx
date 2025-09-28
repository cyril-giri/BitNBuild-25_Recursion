import React from 'react';

export default function DeliverableCard({ deliverable, isClient, onAccept, onRequestRevision }) {
  const { file_url, preview_url, notes, status, created_at, hash } = deliverable;
  
  // --- Core Logic for Watermarking ---
  let displayUrl = file_url; // Default to the original file
  let linkText = "Download Original";

  // If the viewer is a client AND the work is not yet accepted...
  if (isClient && status !== 'accepted') {
    // ...show the watermarked preview if it exists.
    if (preview_url) {
      displayUrl = preview_url;
      linkText = "Download Watermarked Preview";
    } else {
      // If the preview is still being generated
      displayUrl = '#';
      linkText = "Preview is being generated...";
    }
  }
  
  const fileName = file_url.split('/').pop();

  const getStatusClass = (status) => { /* ... (status styling remains the same) ... */ };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 space-y-3">
      <div className="flex justify-between items-start">
        <a href={displayUrl} target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline break-all ${!preview_url && isClient && status !== 'accepted' ? 'text-neutral-500 cursor-not-allowed' : 'text-cyan-400'}`}>
          {linkText}
        </a>
        <span className={`text-xs font-semibold uppercase px-2 py-1 border rounded-full ${getStatusClass(status)}`}>
          {status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-sm text-neutral-300">{notes || 'No notes provided.'}</p>
      <div className="text-xs text-neutral-500 pt-2 border-t border-neutral-800">
        <p>Original Filename: {decodeURIComponent(fileName)}</p>
        <p className="truncate" title={hash}>SHA-256 Hash: {hash}</p>
      </div>
      {isClient && status !== 'accepted' && (
        <div className="flex gap-2 justify-end">
          <button onClick={() => onRequestRevision(deliverable)} className="bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-bold py-1 px-3 rounded">Request Revision</button>
          <button onClick={() => onAccept(deliverable)} className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-3 rounded">✅ Accept & Get Original</button>
        </div>
      )}
    </div>
  );
}