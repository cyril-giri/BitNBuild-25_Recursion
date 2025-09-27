import React from 'react';
import MilestoneCard from './MilestoneCard';
import CreateMilestoneForm from './CreateMilestoneForm';

export default function MilestoneList({ milestones, role, contractId, onCreateMilestone, onSubmitDeliverable, isClient }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
      <h2 className="text-xl font-bold text-white mb-4">Milestones</h2>
      <div className="space-y-4">
        {milestones.length > 0 
          ? milestones.map(milestone => (
              <MilestoneCard 
                key={milestone.id} 
                milestone={milestone} 
                role={role}
                onSubmitDeliverable={onSubmitDeliverable}
              />
            ))
          : <p className="text-neutral-400">No milestones have been created yet.</p>
        }
      </div>
      {isClient && (
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <h3 className="text-lg font-semibold text-white mb-2">Add a New Milestone</h3>
          <CreateMilestoneForm contractId={contractId} onCreateMilestone={onCreateMilestone} />
        </div>
      )}
    </div>
  );
}