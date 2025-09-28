import React, { useState } from 'react';
import StarRating from '../Shared/StarRating';

export default function ReviewForm({ otherParty, onSubmit, loading }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    onSubmit({ rating, comment });
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="font-bold text-lg text-white">Your Review for {otherParty.full_name}</h3>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="text-sm font-semibold text-neutral-400">Rating</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div>
          <label htmlFor="comment" className="text-sm font-semibold text-neutral-400">Comment</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            placeholder={`How was your experience working with ${otherParty.full_name}?`}
            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 mt-1 text-sm text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 text-black font-bold py-2 rounded-lg hover:bg-cyan-400 disabled:bg-neutral-700 transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}