import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AttachmentUploader({ attachments, setAttachments }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      // Create a temporary array to hold the new uploads for this batch
      const newUploadedAttachments = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const filePath = `project-attachment/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('project-attachment') // Ensure this bucket exists
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
      
      // Update the parent state ONCE with all the new files from this batch
      // This is more efficient and uses the current attachments prop to build the new array
      setAttachments([...attachments, ...newUploadedAttachments]);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full border p-4 rounded-lg space-y-2">
      <h3 className="font-semibold text-gray-800">Attachments (Optional)</h3>
      <p className="text-sm text-gray-500">Upload any relevant documents like briefs, mockups, or datasets.</p>
      
      {/* Display uploaded files */}
      {attachments && attachments.length > 0 && (
        <ul className="list-disc pl-5 space-y-1">
          {attachments.map((file, index) => (
            <li key={index} className="text-sm">
              <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      )}

      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
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