import React from 'react';

// A small helper component to render star ratings
const StarRating = ({ rating, totalReviews }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
        {halfStar && <span>★</span>} {/* Simplified half-star for now */}
        {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-neutral-600">☆</span>)}
      </div>
      <span className="text-sm text-neutral-400">
        {rating.toFixed(1)} ({totalReviews} reviews)
      </span>
    </div>
  );
};

export default function ProfileSidebar({ profile, isOwner }) {
  const { 
    avatar_url, 
    full_name, 
    headline, 
    role, 
    rating, 
    total_reviews, 
    created_at 
  } = profile;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 flex flex-col items-center text-center">
      <img
        src={avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${full_name}`}
        alt={full_name}
        className="h-24 w-24 rounded-full bg-neutral-700 border-2 border-neutral-600 mb-4"
      />
      <h1 className="text-2xl font-bold text-white">{full_name}</h1>
      <p className="text-cyan-400 font-medium">{headline}</p>
      <span className="mt-2 text-xs font-semibold uppercase bg-neutral-800 text-neutral-300 px-2 py-1 rounded">
        {role}
      </span>
      
      <div className="my-4 w-full border-t border-neutral-800"></div>

      <StarRating rating={rating} totalReviews={total_reviews} />
      
      <p className="text-sm text-neutral-500 mt-4">
        Member since {new Date(created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
      </p>

      {isOwner && (
        <button className="mt-6 w-full bg-cyan-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors">
          Edit Profile
        </button>
      )}
    </div>
  );
}