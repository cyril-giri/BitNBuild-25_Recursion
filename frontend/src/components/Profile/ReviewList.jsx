import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import ReviewCard from './ReviewCard';
import { useApi } from '../../lib/useApi';

export default function ReviewList({ profileId }) {
  const { data: reviews, loading, error } = useApi({
    fetchFn: () => supabase
      .from('reviews')
      .select('*, from_profile:profiles!reviews_from_id_fkey(*)') // Join to get reviewer's info
      .eq('to_id', profileId)
      .order('created_at', { ascending: false }),
    deps: [profileId]
  });

  if (loading) return <p className="text-neutral-400">Loading reviews...</p>;
  if (error) return <p className="text-red-500">Could not load reviews.</p>;
  if (!reviews || reviews.length === 0) {
    return <p className="text-neutral-500">This user has not received any reviews yet.</p>;
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}