import React, { useState } from 'react';
// Note: This assumes you have a dedicated AttachmentUploader for deliverables
// or a refactored one that can handle different buckets.
// For now, it's a placeholder to show the flow.

export default function SubmitDeliverableModal({ milestone, onSubmit, onClose }) {
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ milestone_id: milestone.id, notes, attachments });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-lg border border-neutral-700">
        <h3 className="text-xl font-bold mb-4">Submit Deliverable for "{milestone.title}"</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400">Notes / Description</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 mt-1 text-sm"
              rows="4"
              placeholder="Add any notes for the client about your submission."
            ></textarea>
          </div>
          {/* <AttachmentUploader attachments={attachments} setAttachments={setAttachments} bucketName="deliverables" /> */}
          <p className="text-xs text-neutral-500">File uploader for deliverables would go here.</p>
          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} className="text-neutral-400 font-semibold py-2 px-4 rounded">Cancel</button>
            <button type="submit" className="bg-cyan-500 text-black font-bold py-2 px-4 rounded">Submit for Review</button>
          </div>
        </form>
      </div>
    </div>
  );
}