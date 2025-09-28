import React from 'react';

// A small component for displaying user pills
const ProfilePill = ({ user, role }) => (
  <div className="flex items-center gap-3">
    <img 
      src={user.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user.full_name}`} 
      alt={user.full_name} 
      className="h-10 w-10 rounded-full bg-neutral-700 border-2 border-neutral-600" 
    />
    <div>
      <p className="font-semibold text-white">{user.full_name}</p>
      <p className="text-xs text-neutral-400 capitalize">{role}</p>
    </div>
  </div>
);

export default function ContractOverview({ contract, milestones }) {
  const { project, client, freelancer, status, start_date } = contract;

  // Calculate financial progress
  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const fundedAmount = milestones
    .filter(m => m.status === 'accepted' || m.status === 'delivered' || m.status === 'funded')
    .reduce((sum, m) => sum + m.amount, 0);
  const progressPercent = totalAmount > 0 ? (fundedAmount / totalAmount) * 100 : 0;

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
      <p className="text-sm text-neutral-400">Contract for: <span className="font-bold text-white">{project.title}</span></p>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-neutral-800">
        <ProfilePill user={client} role="Client" />
        <span className="text-neutral-500 font-mono">↔</span>
        <ProfilePill user={freelancer} role="Freelancer" />
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-white">Financial Progress</span>
          <span className="text-sm text-neutral-400">{formatCurrency(fundedAmount)} / {formatCurrency(totalAmount)}</span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-2.5">
          <div 
            className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}