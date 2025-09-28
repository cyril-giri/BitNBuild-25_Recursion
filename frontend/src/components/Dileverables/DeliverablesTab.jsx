import React from 'react';

const DeliverableCard = ({ deliverable }) => (
  <div className="border border-neutral-800 bg-neutral-900 p-4 rounded-lg">
    <a 
      href={deliverable.file_url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="font-semibold text-cyan-400 hover:underline"
    >
      {deliverable.notes || 'Download Deliverable'}
    </a>
    <p className="text-xs text-neutral-400 mt-1">
      Submitted on: {new Date(deliverable.created_at).toLocaleDateString()}
    </p>
    <div className="mt-2 text-xs font-semibold uppercase px-2 py-1 border rounded-full inline-block
      ${deliverable.status === 'accepted' ? 'text-green-400 border-green-400/50' : 'text-yellow-400 border-yellow-400/50'}">
      {deliverable.status}
    </div>
  </div>
);

export default function DeliverablesTab({ milestones }) {
  // Filter milestones to only include those that have deliverables
  const milestonesWithDeliverables = milestones?.filter(m => m.deliverables && m.deliverables.length > 0) || [];

  if (milestonesWithDeliverables.length === 0) {
    return <p className="text-neutral-500">No deliverables have been submitted for this contract yet.</p>;
  }

  return (
    <div className="space-y-6">
      {milestonesWithDeliverables.map(milestone => (
        <div key={milestone.id}>
          <h4 className="font-bold text-lg text-white mb-2 pb-2 border-b border-neutral-800">
            For Milestone: "{milestone.title}"
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {milestone.deliverables.map(deliverable => (
              <DeliverableCard key={deliverable.id} deliverable={deliverable} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}