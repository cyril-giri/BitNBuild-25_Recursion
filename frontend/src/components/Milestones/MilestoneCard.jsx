import React, { useState } from 'react';
import SubmitDeliverableModal from '../Dileverables/SubmitDileverableModel';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export default function MilestoneCard({ milestone, role, onFund, onSubmit, onApprove }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, description, amount, due_date, status } = milestone;

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

  const ActionButton = () => {
    if (role === 'client') {
      if (status === 'pending') return <button onClick={onFund} className="bg-cyan-500 text-black text-xs font-bold py-1 px-3 rounded">Fund Milestone</button>;
      if (status === 'delivered') return <button onClick={onApprove} className="bg-green-500 text-white text-xs font-bold py-1 px-3 rounded">Approve & Release</button>;
    }
    if (role === 'freelancer' && status === 'funded') {
      return <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white text-xs font-bold py-1 px-3 rounded">Submit Work</button>;
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
        <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center">
          <div>
            <span className={`text-xs font-semibold uppercase px-2 py-1 border rounded-full ${getStatusClass(status)}`}>
              {status}
            </span>
          </div>
          <ActionButton />
        </div>
      </div>
      {isModalOpen && (
        <SubmitDeliverableModal
          milestone={milestone}
          onClose={() => setIsModalOpen(false)}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
}