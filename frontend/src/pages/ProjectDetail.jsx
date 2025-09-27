import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useApi } from '../lib/useApi';
import { useAuth } from '../context/AuthContext';

// Import Components
import ProjectSummary from '../components/Projects/ProjectSummary';
import BidForm from '../components/Projects/BidForm';
import BidList from '../components/Bids/BidList';

// Helper function needed for the cleanup process
const getPathFromUrl = (url, bucketName) => {
  if (!url || !bucketName) return null;
  try {
    const { pathname } = new URL(url);
    const bucketPath = `/storage/v1/object/public/${bucketName}/`;
    if (!pathname.startsWith(bucketPath)) return null;
    return decodeURIComponent(pathname.substring(bucketPath.length));
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};


export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, role } = useAuth();

  const [bid, setBid] = useState({
    proposal: '',
    bid_amount: '',
    eta_days: '',
    attachments: [], // State for bid attachments
  });

  // Fetch project details
  const { data: project, loading: projectLoading, error: projectError } = useApi({
    fetchFn: () => supabase.from('projects').select('*').eq('id', id).single(),
    deps: [id],
  });

  // Fetch existing bids for the project
  const { data: bids, loading: bidsLoading } = useApi({
    fetchFn: () => supabase.from('bids').select('*, freelancer:profiles(*)').eq('project_id', id),
    deps: [id],
  });

  // API hook to submit the bid
  const { loading: bidSubmitting, error: bidError, refetch: submitBid } = useApi({
    fetchFn: async () => {
      const bidData = {
        project_id: id,
        freelancer_id: profile.id,
        proposal: bid.proposal,
        bid_amount: Number(bid.bid_amount),
        eta_days: Number(bid.eta_days),
        attachments: bid.attachments,
      };
      return await supabase.from('bids').insert([bidData]).select();
    },
    manual: true,
  });

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (role !== 'freelancer' || !profile) {
      alert("Only freelancers can submit bids.");
      return;
    }
    const result = await submitBid();

    // If there's an error, attempt to clean up any uploaded files
    if (result.error) {
      alert(`Submission failed: ${result.error.message}`);
      
      if (bid.attachments.length > 0) {
        console.log("Bid submission failed. Cleaning up bid attachments...");
        const bucketName = 'bid-attachments';
        const filePaths = bid.attachments.map(file => getPathFromUrl(file.file_url, bucketName)).filter(Boolean);

        if (filePaths.length > 0) {
          const { error: removeError } = await supabase.storage
            .from(bucketName)
            .remove(filePaths);

          if (removeError) {
            console.error("CRITICAL: Failed to delete orphaned bid files:", removeError.message);
          } else {
            console.log("Cleanup of bid attachments successful.");
          }
        }
      }
    } else {
      alert("Your bid has been submitted successfully!");
      navigate('/dashboard');
    }
  };

  if (projectLoading || bidsLoading) return <div className="text-center mt-20">Loading Project...</div>;
  if (projectError || !project) return <div className="text-center mt-20 text-red-500">Error: Project not found.</div>;

  const isClientOwner = role === 'client' && profile?.id === project.client_id;
  const canBid = role === 'freelancer' && project.status === 'open';

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-12 px-4">
      <div className="w-full max-w-4xl">
        <ProjectSummary project={project} />

        <div className="mt-8">
          {isClientOwner && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Bids Received</h2>
              <BidList bids={bids} />
            </div>
          )}

          {canBid && (
            <BidForm
              bid={bid}
              setBid={setBid}
              onSubmit={handleBidSubmit}
              loading={bidSubmitting}
            />
          )}
        </div>

        {bidError && <div className="mt-4 text-red-500 bg-red-50 p-3 rounded">{bidError.message}</div>}
        {project.status !== 'open' && (
           <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center mt-8">
             This project is no longer open for bidding.
           </div>
        )}
      </div>
    </div>
  );
}