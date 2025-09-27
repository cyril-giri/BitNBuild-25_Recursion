import React from "react";
import BidCard from "./BidCard";

const BidList = ({ bids, onAccept, projectStatus }) => {
  if (!bids || bids.length === 0) {
    return <div className="text-neutral-400 mt-4">No bids yet.</div>;
  }
  return (
    <div>
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

export default BidList;