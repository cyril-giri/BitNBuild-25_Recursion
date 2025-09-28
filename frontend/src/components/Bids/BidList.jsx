import React from 'react';
import BidCard from "./BidCard";

export default function BidList({ bids, onAccept, projectStatus }) {
  if (!bids) {
    return <div className="text-neutral-400 mt-4">Loading bids...</div>;
  }
  if (bids.length === 0) {
    return <div className="text-neutral-400 mt-4">No bids have been submitted for this project yet.</div>;
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <BidCard
          key={bid.id}
          bid={bid}
          onAccept={onAccept}
          disabled={projectStatus !== "open"}
        />
      ))}
    </div>
  );
};