import React from 'react';

const StarRating = ({ rating }) => (
  <div className="flex text-yellow-400">
    {[...Array(5)].map((_, i) => (
      <span key={i}>{i < rating ? '★' : '☆'}</span>
    ))}
  </div>
);

export default function ReviewCard({ review }) {
  const reviewer = review.from_profile || {};

  return (
    <div className="border-b border-neutral-800 py-4">
      <div className="flex items-start gap-4">
        <img
          src={reviewer.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${reviewer.full_name}`}
          alt={reviewer.full_name}
          className="h-10 w-10 rounded-full bg-neutral-700"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">{reviewer.full_name}</p>
              <p className="text-xs text-neutral-400">
                {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <StarRating rating={review.rating} />
          </div>
          <p className="text-neutral-300 mt-2 text-sm">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}