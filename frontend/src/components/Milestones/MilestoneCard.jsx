import React, { useState } from 'react';
import SubmitWorkModal from '../Dileverables/SubmitWorkModal';


const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

// A component to display a link to a single deliverable file
const DeliverableLink = ({ deliverable, isClient }) => {
  const { status, file_url, preview_url } = deliverable;
  
  let displayUrl = file_url;
  let linkText = "Download Original";

  // If the viewer is a client and the work is not yet accepted, show the preview link
  if (isClient && status !== 'accepted') {
    if (preview_url) {
      displayUrl = preview_url;
      linkText = "Download Preview";
    } else {
      displayUrl = '#';
      linkText = "Preview Generating...";
    }
  }

  return (
    <a 
      href={displayUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`text-sm flex items-center gap-2 ${displayUrl === '#' ? 'text-neutral-500 cursor-not-allowed' : 'text-cyan-400 hover:underline'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
      {linkText}
    </a>
  );
};


export default function MilestoneCard({ milestone, isClient, role, onApproveWork, onRejectWork, onFreelancerCancel, onSubmitDeliverable, onFund }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, description, amount, due_date, status, escrow, deliverables } = milestone;

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
    } else { // Freelancer's buttons
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
    return null;
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

        {deliverables && deliverables.length > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <h5 className="text-xs font-bold text-neutral-400 mb-2">SUBMITTED WORK</h5>
            <div className="space-y-2">
              {deliverables.map(d => (
                <DeliverableLink key={d.id} deliverable={d} isClient={isClient} />
              ))}
            </div>
          </div>
        )}
        
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