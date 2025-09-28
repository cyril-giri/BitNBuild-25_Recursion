import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

// A simple function to calculate SHA-256 hash
async function calculateHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function UploadDeliverablePanel({ milestoneId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setIsUploading(true);

    try {
      const hash = await calculateHash(file);
      const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const filePath = `deliverables/${milestoneId}/${Date.now()}-${sanitizedFilename}`;

      // Upload the original file to storage
      const { error: uploadError } = await supabase.storage.from('deliverables').upload(filePath, file);
      if (uploadError) throw uploadError;

      // Get the public URL for the original file
      const { data: publicData } = supabase.storage.from('deliverables').getPublicUrl(filePath);
      
      // Pass the original file_url, hash, and notes to the parent.
      // The backend will handle creating and adding the preview_url.
      await onUploadSuccess({
        notes,
        file_url: publicData.publicUrl,
        hash
      });

      setFile(null);
      setNotes('');

    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="text-lg font-bold text-white">Upload New Deliverable</h3>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input type="file" onChange={handleFileChange} className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/50 file:text-cyan-300 hover:file:bg-cyan-800/50" required />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this version..."
          rows="3"
          className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-sm text-white"
        />
        <button type="submit" disabled={isUploading} className="w-full bg-cyan-500 text-black font-bold py-2 rounded-lg disabled:bg-neutral-700">
          {isUploading ? 'Uploading...' : 'Submit Deliverable'}
        </button>
      </form>
    </div>
  );
}