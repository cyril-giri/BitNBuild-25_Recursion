import React, { useState } from 'react';

// This component can be used for both display and input
export default function StarRating({ rating, setRating, readOnly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex text-2xl">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={starValue}
            className={`transition-colors ${readOnly ? '' : 'cursor-pointer'} ${
              starValue <= (hover || rating) ? 'text-yellow-400' : 'text-neutral-600'
            }`}
            onClick={() => !readOnly && setRating(starValue)}
            onMouseEnter={() => !readOnly && setHover(starValue)}
            onMouseLeave={() => !readOnly && setHover(0)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}