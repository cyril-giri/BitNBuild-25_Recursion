import React from 'react';

const ProfilePill = ({ user }) => (
  <div className="flex items-center gap-2">
    <img src={user.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user.full_name}`} alt={user.full_name} className="h-8 w-8 rounded-full bg-neutral-700" />
    <div>
      <p className="font-semibold text-white">{user.full_name}</p>
      <p className="text-xs text-neutral-400 capitalize">{user.role}</p>
    </div>
  </div>
);

export default function ContractOverview({ contract }) {
  const { project, client, freelancer, status, start_date } = contract;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
      <p className="text-sm text-neutral-400">Contract</p>
      <h1 className="text-2xl font-bold text-white mt-1">{project.title}</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-neutral-800">
        <ProfilePill user={client} />
        <span className="text-neutral-500">working with</span>
        <ProfilePill user={freelancer} />
      </div>
      <div className="mt-4 pt-4 border-t border-neutral-800 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-neutral-400">Status</p>
          <p className="font-semibold text-cyan-400 capitalize">{status}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-400">Start Date</p>
          <p className="font-semibold">{new Date(start_date).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}