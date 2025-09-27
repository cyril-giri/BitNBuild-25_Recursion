import React from 'react';
import BidAttachmentUploader from '../Bids/BidAttachmentUploader'; // <-- Import the new component

export default function BidForm({ bid, setBid, onSubmit, loading }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBid(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full space-y-4 mt-8">
      <h2 className="text-2xl font-bold text-gray-800">Submit Your Bid</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="bid_amount" className="block text-sm font-medium text-gray-700">Your Bid Amount ($)</label>
          <input
            type="number"
            name="bid_amount"
            id="bid_amount"
            value={bid.bid_amount}
            onChange={handleChange}
            placeholder="e.g., 1500"
            className="border p-2 w-full rounded mt-1"
            required
          />
        </div>
        <div>
          <label htmlFor="eta_days" className="block text-sm font-medium text-gray-700">Estimated Days to Complete</label>
          <input
            type="number"
            name="eta_days"
            id="eta_days"
            value={bid.eta_days}
            onChange={handleChange}
            placeholder="e.g., 14"
            className="border p-2 w-full rounded mt-1"
            required
          />
        </div>
        <div>
          <label htmlFor="proposal" className="block text-sm font-medium text-gray-700">Proposal / Cover Letter</label>
          <textarea
            name="proposal"
            id="proposal"
            rows="6"
            value={bid.proposal}
            onChange={handleChange}
            placeholder="Explain why you are the best fit for this project. Outline your approach."
            className="border p-2 w-full rounded mt-1"
            required
          ></textarea>
        </div>
        
        {/* Use the new, dedicated uploader for bids */}
        <BidAttachmentUploader 
          attachments={bid.attachments} 
          setAttachments={(files) => setBid(prev => ({ ...prev, attachments: files }))} 
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-500 text-white font-bold py-3 w-full rounded hover:bg-cyan-600 transition-colors duration-300 disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </form>
    </div>
  );
}