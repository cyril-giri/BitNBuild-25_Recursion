import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Helper function to extract the path from the full Supabase URL
// This version correctly handles paths that are inside folders within the bucket.
// A more robust helper function
const getPathFromUrl = (url) => {
  try {
    const { pathname } = new URL(url);
    // Find the position of the bucket name in the path
    const bucketName = 'project-attachment'; // Make sure this matches your bucket name
    const bucketIndex = pathname.indexOf(bucketName);
    
    // Extract everything after the bucket name and the next slash
    if (bucketIndex === -1) return null;
    return decodeURIComponent(pathname.substring(bucketIndex + bucketName.length + 1));
    
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

export default function AttachmentUploader({ attachments, setAttachments }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const newUploadedAttachments = [];
      for (const file of files) {
        // --- RESTORED: Your desired folder path is back ---
        const filePath = `project-attachment/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('project-attachment')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from('project-attachment')
          .getPublicUrl(filePath);
        
        const newAttachment = {
          file_url: publicData.publicUrl,
          name: file.name,
          type: file.type,
        };
        newUploadedAttachments.push(newAttachment);
      }
      
      setAttachments([...attachments, ...newUploadedAttachments]);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = async (fileToRemove, index) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    
    // The corrected helper function now gets the right path
    const path = getPathFromUrl(fileToRemove.file_url);
    console.log("Removing file at path:", path); // Will now log the correct path
    if (!path) return;

    const { data, error: removeError } = await supabase.storage
      .from('project-attachment')
      .remove([path]);

    if (removeError) {
      console.error("Failed to delete file from storage:", removeError.message);
      setAttachments(attachments); 
      setError(`Could not remove ${fileToRemove.name}. Please try again.`);
    } else {
      console.log("Successfully deleted:", data);
    }
  };

  return (
    <div className="w-full border p-4 rounded-lg space-y-2">
      <h3 className="font-semibold text-gray-800">Attachments (Optional)</h3>
      <p className="text-sm text-gray-500">Upload any relevant documents like briefs, mockups, or datasets.</p>
      
      {attachments && attachments.length > 0 && (
        <ul className="space-y-2 pt-2">
          {attachments.map((file, index) => (
            <li key={index} className="text-sm flex items-center justify-between bg-gray-50 p-2 rounded">
              <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline truncate pr-4">
                {file.name}
              </a>
              <button
                type="button"
                onClick={() => handleRemoveFile(file, index)}
                className="text-red-500 hover:text-red-700 font-semibold text-xs flex-shrink-0"
              >
                REMOVE
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 pt-2
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-cyan-50 file:text-cyan-700
          hover:file:bg-cyan-100"
      />
      {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}