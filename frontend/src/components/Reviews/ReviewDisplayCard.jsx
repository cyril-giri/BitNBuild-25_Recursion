import React from 'react';
import StarRating from '../Shared/StarRating';

export default function ReviewDisplayCard({ review, title }) {
  const reviewer = review.from_profile || {};

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="font-bold text-lg text-white mb-4">{title}</h3>
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
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
            <StarRating rating={review.rating} readOnly={true} />
          </div>
          <p className="text-neutral-300 mt-2 text-sm">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}