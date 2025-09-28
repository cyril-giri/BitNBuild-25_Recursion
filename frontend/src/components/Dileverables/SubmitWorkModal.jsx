import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Helper function to calculate SHA-256 hash
async function calculateHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const DeliverableUploader = ({ attachments, setAttachments, milestoneId }) => {
  const [uploading, setUploading] = useState(false);
  const BUCKET_NAME = "deliverables";

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const hash = await calculateHash(file); // Calculate hash on selection
      const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filePath = `milestones/${milestoneId}/${Date.now()}-${sanitizedFilename}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      // --- FIX: Include the 'hash' in the state ---
      setAttachments([
        {
          file_url: publicData.publicUrl,
          name: file.name,
          type: file.type,
          hash: hash, // Pass the hash along
        },
      ]);
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="text-sm text-neutral-400">
        Attach Deliverable File
      </label>
      <input
        type="file"
        onChange={handleFileSelect}
        className="block w-full text-sm text-neutral-400 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/50 file:text-cyan-300 hover:file:bg-cyan-800/50"
      />
      {uploading && <p className="text-xs text-cyan-400 mt-1">Uploading...</p>}
      {attachments[0] && (
        <p className="text-xs text-green-400 mt-1">
          File attached: {attachments[0].name}
        </p>
      )}
    </div>
  );
};

export default function SubmitWorkModal({ milestone, onSubmit, onClose }) {
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (attachments.length === 0) {
      alert("Please attach a deliverable file.");
      return;
    }
    onSubmit({ milestone_id: milestone.id, notes, attachments });
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-lg border border-neutral-700">
        <h3 className="text-xl font-bold mb-4">
          Submit Work for "{milestone.title}"
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400">
              Notes / Description
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 mt-1 text-sm"
              rows="4"
              placeholder="Add notes for the client about your submission..."
            ></textarea>
          </div>
          <DeliverableUploader
            attachments={attachments}
            setAttachments={setAttachments}
            milestoneId={milestone.id} // Pass milestoneId down
          />
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 font-semibold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-500 text-black font-bold py-2 px-4 rounded"
            >
              Submit for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
