import React, { useState } from 'react';
import SubmitDeliverableModal from '../Dileverables/SubmitDileverableModel';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export default function MilestoneCard({ milestone, role, onSubmitDeliverable }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, description, amount, due_date, status, deliverables } = milestone;

  return (
    <>
      <div className="border border-neutral-800 bg-neutral-900 p-4 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-sm text-neutral-400 mt-1">{description}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-cyan-400">{formatCurrency(amount)}</p>
            <p className="text-xs text-neutral-500">Due: {new Date(due_date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold uppercase text-neutral-400">Status: </span>
            <span className="font-semibold capitalize">{status}</span>
          </div>
          {role === 'client' && status === 'pending' && <button className="bg-cyan-500 text-black text-xs font-bold py-1 px-3 rounded">Fund Milestone</button>}
          {role === 'freelancer' && status === 'funded' && <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white text-xs font-bold py-1 px-3 rounded">Submit Work</button>}
          {status === 'delivered' && <button className="bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded">Review Work</button>}
        </div>
      </div>
      {isModalOpen && (
        <SubmitDeliverableModal 
          milestone={milestone}
          onClose={() => setIsModalOpen(false)}
          onSubmit={onSubmitDeliverable}
        />
      )}
    </>
  );
}