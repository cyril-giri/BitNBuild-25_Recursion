import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';
import ReviewForm from '../components/Reviews/ReviewForm';
import ReviewDisplayCard from '../components/Reviews/ReviewDisplayCard';
import { useApi } from '../lib/useApi';

export default function LeaveReview() {
  const { id } = useParams(); // This is the contract_id
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Fetch the contract and all related reviews
  const { data, loading, error, refetch } = useApi({
    fetchFn: async () => {
      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .select('*, project:projects(*), client:profiles!contracts_client_id_fkey(*), freelancer:profiles!contracts_freelancer_id_fkey(*)')
        .eq('id', id)
        .single();
      if (contractError) throw contractError;
      
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*, from_profile:profiles!reviews_from_id_fkey(*)')
        .eq('contract_id', id);
      if (reviewsError) throw reviewsError;
      
      return { contract: contractData, reviews: reviewsData };
    },
    deps: [id]
  });

  const { contract, reviews } = data || {};
  
  // Logic for submitting the review form
  const { loading: isSubmitting, refetch: submitReview } = useApi({
    // --- FIX: Added ({ rating, comment }) as parameters to receive the form data ---
    fetchFn: async ({ rating, comment }) => {
      const otherParty = contract.client.id === profile.id ? contract.freelancer : contract.client;
      return supabase.rpc('submit_review_and_update_profile', {
        p_contract_id: id,
        p_from_id: profile.id,
        p_to_id: otherParty.id,
        p_rating: rating,
        p_comment: comment
      });
    },
    manual: true,
    deps: [contract, profile]
  });

  const handleReviewSubmit = async (reviewData) => {
    if (!contract || !profile) {
      alert("Data is not ready, please wait a moment.");
      return;
    }

    const { error } = await submitReview(reviewData);
    if (error) {
      alert("Error submitting review: " + (error.message || JSON.stringify(error)));
    } else {
      alert("Thank you for your feedback!");
      refetch(); // Refresh the page to show the newly submitted review
    }
  };

  if (loading) return <div className="text-center text-white mt-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-20">Error: {error.message}</div>;
  if (!contract || !reviews) return <div className="text-center text-neutral-400 mt-20">Contract not found.</div>;
  
  const myReview = reviews.find(r => r.from_id === profile?.id);
  const otherPartyReview = reviews.find(r => r.from_id !== profile?.id);
  const otherParty = contract.client.id === profile?.id ? contract.freelancer : contract.client;

  return (
    <div className="bg-neutral-950 min-h-screen text-white">
      <LoggedInNavbar />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="text-center mb-8">
          <p className="text-neutral-400">Review for Contract</p>
          <h1 className="text-3xl font-bold">{contract.project.title}</h1>
        </div>
        
        <div className="space-y-6">
          {!myReview && contract.status === 'completed' && (
            <ReviewForm
              otherParty={otherParty}
              onSubmit={handleReviewSubmit}
              loading={isSubmitting}
            />
          )}

          {myReview && (
            <ReviewDisplayCard review={myReview} title="Your Submitted Review" />
          )}

          {otherPartyReview ? (
            <ReviewDisplayCard review={otherPartyReview} title={`Review from ${otherParty.full_name}`} />
          ) : (
            <div className="text-center text-neutral-500 p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
              <p>Waiting for feedback from {otherParty.full_name}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}