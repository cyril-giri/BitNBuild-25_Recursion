import React, { useState } from 'react';
import SubmitWorkModal from '../Dileverables/SubmitWorkModal';
// --- FIX: Corrected typo in the import path ---

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export default function MilestoneCard({ milestone, isClient, onApproveWork, onRejectWork, onFreelancerCancel, onSubmitDeliverable, onFund }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, description, amount, due_date, status, escrow } = milestone;

  // Check the escrow status for this milestone. Assumes escrow is an array and we take the first entry.
  const escrowStatus = escrow && escrow.length > 0 ? escrow[0].status : null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 border-yellow-400/50';
      case 'funded': return 'text-cyan-400 border-cyan-400/50';
      case 'delivered': return 'text-blue-400 border-blue-400/50';
      case 'accepted': return 'text-green-400 border-green-400/50';
      case 'rejected': return 'text-red-400 border-red-400/50';
      default: return 'text-neutral-400 border-neutral-700';
    }
  };

  const ActionButtons = () => {
    // Client's buttons
    if (isClient) {
      if (status === 'pending') {
        return <button onClick={() => onFund(milestone.id)} className="bg-cyan-500 text-black text-xs font-bold py-1 px-3 rounded">Fund Milestone</button>;
      }
      if (status === 'delivered') {
        return (
          <div className="flex gap-2">
            <button onClick={() => onRejectWork(milestone.id)} className="bg-red-800 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded">❌ Reject</button>
            <button onClick={() => onApproveWork(milestone.id)} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded">✅ Approve & Release</button>
          </div>
        );
      }
    } 
    // Freelancer's buttons
    else { 
      if (status === 'funded') {
        return <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded">Submit Work</button>;
      }
      if (status === 'delivered') {
        return <span className="text-xs text-neutral-400">Awaiting Client Review</span>;
      }
      if (escrowStatus === 'funded' && status !== 'delivered') {
        return <button onClick={() => onFreelancerCancel(milestone.id)} className="bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-bold py-1 px-3 rounded">Cancel Milestone</button>;
      }
    }
    return null; // No buttons to show
  };

  return (
    <>
      <div className="border border-neutral-800 bg-neutral-900 p-4 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-sm text-neutral-400 mt-1">{description}</p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-lg font-semibold text-cyan-400">{formatCurrency(amount)}</p>
            {due_date && <p className="text-xs text-neutral-500">Due: {new Date(due_date).toLocaleDateString()}</p>}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center">
          <div>
            <span className={`text-xs font-semibold uppercase px-2 py-1 border rounded-full ${getStatusClass(status)}`}>
              {status}
            </span>
            {escrowStatus && <span className="ml-2 text-xs font-semibold uppercase text-cyan-400">({escrowStatus})</span>}
          </div>
          <ActionButtons />
        </div>
      </div>
      
      {isModalOpen && (
        <SubmitWorkModal
          milestone={milestone}
          onClose={() => setIsModalOpen(false)}
          onSubmit={onSubmitDeliverable}
        />
      )}
    </>
  );
}