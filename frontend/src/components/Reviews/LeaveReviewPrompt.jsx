import React from 'react';
import { Link } from 'react-router-dom';

export default function LeaveReviewPrompt({ contractId, hasUserReviewed }) {
  return (
    <div className="rounded-2xl border border-cyan-800 bg-cyan-900/50 p-6 text-center">
      <h3 className="text-xl font-bold text-white">
        {hasUserReviewed ? "Thank You for Your Feedback!" : "This Contract is Complete!"}
      </h3>
      <p className="text-cyan-200 mt-2">
        {hasUserReviewed 
          ? "You have already submitted your review for this contract."
          : "Please share your feedback to help our community."
        }
      </p>
      {!hasUserReviewed && (
        <Link 
          to={`/contracts/${contractId}/review`}
          className="mt-4 inline-block bg-cyan-500 text-black font-bold py-2 px-6 rounded-lg hover:bg-cyan-400 transition-colors"
        >
          Leave a Review
        </Link>
      )}
    </div>
  );
}