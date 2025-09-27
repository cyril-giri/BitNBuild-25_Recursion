import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Helper function to extract the path from a full Supabase URL for this specific bucket
const getPathFromUrl = (url) => {
  try {
    const { pathname } = new URL(url);
    const bucketName = 'bid-attachments'; // Hardcoded for bids
    const bucketPath = `/storage/v1/object/public/${bucketName}/`;
    
    if (!pathname.startsWith(bucketPath)) {
      console.warn(`URL path "${pathname}" does not match expected bucket path for "${bucketName}".`);
      return null;
    }
    
    return decodeURIComponent(pathname.substring(bucketPath.length));
    
  } catch (error) {
    console.error("Invalid URL provided to getPathFromUrl:", error);
    return null;
  }
};

export default function BidAttachmentUploader({ attachments, setAttachments }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const BUCKET_NAME = 'bid-attachments';
  const FOLDER_PATH = 'bid-attachments';

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const newUploadedAttachments = [];
      for (const file of files) {
        const filePath = `${FOLDER_PATH}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from(BUCKET_NAME)
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
      console.error(`Upload error in ${BUCKET_NAME}:`, err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = async (fileToRemove, index) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    
    const path = getPathFromUrl(fileToRemove.file_url);
    if (!path) return;

    const { data, error: removeError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (removeError) {
      console.error(`Failed to delete from ${BUCKET_NAME}:`, removeError.message);
      setAttachments(attachments); 
      setError(`Could not remove ${fileToRemove.name}. Please try again.`);
    } else {
      console.log(`Successfully deleted from ${BUCKET_NAME}:`, data);
    }
  };

  return (
    <div className="w-full border p-4 rounded-lg space-y-2">
      <h3 className="font-semibold text-gray-800">Add Attachments (Optional)</h3>
      <p className="text-sm text-gray-500">You can attach your portfolio, resume, or other relevant files.</p>
      
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
        className="block w-full text-sm text-gray-500 pt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
      />
      {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}