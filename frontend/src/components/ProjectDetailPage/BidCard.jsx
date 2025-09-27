import React from "react";
import {Button} from "../ui/button";

const BidCard = ({ bid, onAccept, disabled }) => {
  const freelancer = bid.profiles || {};
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-lg">
            {freelancer.full_name ? freelancer.full_name[0] : "?"}
          </div>
          <div>
            <div className="font-semibold text-white">{freelancer.full_name || "Freelancer"}</div>
            <div className="text-xs text-neutral-400">{freelancer.headline || ""}</div>
          </div>
        </div>
        <div className="mb-2">
          <span className="font-medium text-cyan-400">${bid.bid_amount}</span>
          <span className="ml-4 text-neutral-400">ETA: {bid.eta_days} days</span>
        </div>
        <div className="mb-2">
          <span className="text-neutral-400 text-sm">{bid.proposal}</span>
        </div>
        {bid.attachments && bid.attachments.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-neutral-400 mb-1">Attachments:</div>
            <ul className="flex flex-wrap gap-2">
              {bid.attachments.map((file, i) => (
                <li key={i}>
                  <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline text-xs">
                    {file.name || file.file_url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-2 mt-4 md:mt-0 md:ml-6">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          bid.status === "accepted"
            ? "bg-cyan-400 text-black"
            : bid.status === "rejected"
            ? "bg-red-500 text-white"
            : "bg-neutral-800 text-white"
        }`}>
          {bid.status}
        </span>
        {bid.status === "pending" && (
          <Button
            className="mt-2"
            onClick={() => onAccept(bid.id, bid.freelancer_id)}
            disabled={disabled}
          >
            Accept Bid
          </Button>
        )}
      </div>
    </div>
  );
};

export default BidCard;