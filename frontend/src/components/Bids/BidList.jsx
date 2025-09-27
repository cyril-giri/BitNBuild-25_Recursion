import React from 'react';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

// This would be a more complex component in a real app, with an "Accept" button and handler
const BidCard = ({ bid }) => (
  <div className="border border-gray-200 p-4 rounded-lg">
    <div className="flex justify-between items-center">
      <h4 className="font-bold">{bid.freelancer.full_name || 'Anonymous Freelancer'}</h4>
      <div className="text-right">
        <p className="font-semibold text-lg">{formatCurrency(bid.bid_amount)}</p>
        <p className="text-sm text-gray-500">{bid.eta_days} days</p>
      </div>
    </div>
    <p className="mt-2 text-gray-600 whitespace-pre-wrap">{bid.proposal}</p>
    <button className="mt-4 w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600">
      Accept Bid
    </button>
  </div>
);


export default function BidList({ bids }) {
  if (!bids || bids.length === 0) {
    return <p className="text-gray-500">No bids have been submitted for this project yet.</p>;
  }

  return (
    <div className="space-y-4">
      {bids.map(bid => <BidCard key={bid.id} bid={bid} />)}
    </div>
  );
}