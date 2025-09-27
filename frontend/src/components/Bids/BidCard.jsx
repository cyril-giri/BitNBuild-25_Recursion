import React from 'react';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export default function BidCard({ bid, onAccept, disabled }) {
  const freelancer = bid.freelancer || {}; 

  const getStatusClass = (status) => {
    switch (status) {
      case 'accepted': return 'bg-cyan-400 text-black';
      case 'rejected': return 'bg-red-800 text-red-200';
      default: return 'bg-neutral-800 text-neutral-300';
    }
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 flex flex-col md:flex-row md:justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-lg border border-neutral-700">
            {freelancer.full_name ? freelancer.full_name[0].toUpperCase() : "?"}
          </div>
          <div>
            <div className="font-semibold text-white">{freelancer.full_name || "Freelancer"}</div>
            <div className="text-xs text-neutral-400">{freelancer.headline || "No headline"}</div>
          </div>
        </div>
        <div className="mb-3">
          <span className="font-medium text-xl text-cyan-400">{formatCurrency(bid.bid_amount)}</span>
          <span className="ml-4 text-neutral-400 text-sm">ETA: {bid.eta_days} days</span>
        </div>
        <p className="text-neutral-300 text-sm whitespace-pre-wrap mb-3">{bid.proposal}</p>
      </div>
      <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0 md:ml-6">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusClass(bid.status)}`}>
          {bid.status}
        </span>
        {bid.status === "pending" && (
          <button
            className="mt-2 bg-cyan-500 text-black font-bold py-2 px-4 rounded hover:bg-cyan-400 disabled:bg-neutral-700 disabled:cursor-not-allowed transition-colors"
            onClick={() => onAccept(bid)} // <-- Calls the prop from the parent
            disabled={disabled}
          >
            Accept Bid
          </button>
        )}
      </div>
    </div>
  );
};