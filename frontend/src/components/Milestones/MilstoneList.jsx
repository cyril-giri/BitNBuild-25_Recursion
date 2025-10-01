import React from 'react';
import CreateMilestoneForm from './CreateMilestoneForm';
import MilestoneCard from './MilestoneCard';

export default function MilestoneList({ 
  milestones, 
  role, 
  isClient, 
  onCreateMilestone, 
  onFundMilestone, 
  onSubmitDeliverable, 
  onApproveWork,
  onRejectWork,
  onFreelancerCancel,
  onRefundIfDeadlineMissed
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Milestones</h2>
      <div className="space-y-4">
        {milestones.length > 0 
          ? milestones.map(milestone => (
              <MilestoneCard
                key={milestone.id} 
                milestone={milestone} 
                role={role}
                isClient={isClient}
                onFund={onFundMilestone}
                onSubmitDeliverable={onSubmitDeliverable}
                onApproveWork={onApproveWork}
                onRejectWork={onRejectWork}
                onFreelancerCancel={onFreelancerCancel}
                onRefundIfDeadlineMissed={onRefundIfDeadlineMissed}
              />
            ))
          : <p className="text-neutral-400">No milestones have been created for this contract yet.</p>
        }
      </div>
      
      {isClient && (
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <h3 className="text-lg font-semibold text-white mb-3">Add a New Milestone</h3>
          <CreateMilestoneForm onCreateMilestone={onCreateMilestone} />
        </div>
      )}
    </div>
  );
}