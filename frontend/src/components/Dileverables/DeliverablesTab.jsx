import React from 'react';
import DeliverableCard from './DeliverableCard'; // Assuming you create this separate component

export default function DeliverablesTab({ milestones, isClient, onAccept, onRequestRevision }) {
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
              <DeliverableCard 
                key={deliverable.id} 
                deliverable={deliverable}
                isClient={isClient}
                onAccept={onAccept}
                onRequestRevision={onRequestRevision}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}