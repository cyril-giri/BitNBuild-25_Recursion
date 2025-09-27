import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

// Import Child Components
import ProjectSummary from '../components/Projects/ProjectSummary';
import BidList from '../components/Bids/BidList';
import BidForm from '../components/Projects/BidForm';
import { useApi } from '../lib/useApi';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, role } = useAuth();

  // State for the freelancer's bid form
  const [bid, setBid] = useState({
    proposal: '',
    bid_amount: '',
    eta_days: '',
    attachments: [],
  });

  // State for the client's bid acceptance action
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState(null);

  // --- Data Fetching ---
  const { data: project, loading: loadingProject, error: errorProject, refetch: refetchProject } = useApi({
    fetchFn: () => supabase.from("projects").select("*").eq("id", id).single(),
    deps: [id],
  });

  const { data: bids, loading: loadingBids, refetch: refetchBids } = useApi({
    fetchFn: () => supabase.from("bids").select("*, freelancer:profiles(*)").eq("project_id", id),
    deps: [id],
  });

  // --- Freelancer Logic ---
  const { loading: submittingBid, refetch: submitBid } = useApi({
    fetchFn: async () => {
      const bidData = { 
        project_id: id, 
        freelancer_id: profile.id, 
        proposal: bid.proposal,
        bid_amount: Number(bid.bid_amount),
        eta_days: Number(bid.eta_days),
        attachments: bid.attachments
      };
      return supabase.from('bids').insert([bidData]);
    },
    manual: true,
    deps: [profile, bid, id]
  });

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const { error } = await submitBid();
    if (error) {
      alert(`Error submitting bid: ${error.message}`);
    } else {
      alert("Bid submitted successfully!");
      refetchBids();
    }
  };

  // --- Client Logic ---
  const handleAcceptBid = async (acceptedBid) => {
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    
    if (!project) {
        alert("Project data is not ready. Please try again.");
        return;
    }

    if (window.confirm(`Are you sure you want to accept this bid for ${formatCurrency(acceptedBid.bid_amount)}?`)) {
      setIsAccepting(true);
      setAcceptError(null);
      
      try {
        const { error } = await supabase.rpc('accept_bid_and_create_contract', {
          accepted_bid_id: acceptedBid.id,
          project_id_in: project.id,
          client_id_in: project.client_id
        });

        if (error) throw error;

        alert("Bid accepted and contract created successfully!");
        refetchProject();
        refetchBids();

      } catch (error) {
        console.error("Error accepting bid:", error);
        setAcceptError(error.message || "An unexpected error occurred.");
        alert("An error occurred: " + (error.message || JSON.stringify(error)));
      } finally {
        setIsAccepting(false);
      }
    }
  };


  if (loadingProject || loadingBids) return <div className="text-center text-white mt-20">Loading...</div>;
  if (errorProject) return <div className="text-center text-red-500 mt-20">Error: {errorProject.message}</div>;
  if (!project) return <div className="text-center text-neutral-400 mt-20">Project not found.</div>;

  const isClientOwner = role === 'client' && profile?.id === project.client_id;
  const canFreelancerBid = role === 'freelancer' && project.status === 'open';

  return (
    <div className="bg-neutral-950 min-h-screen text-white">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <ProjectSummary project={project} />
        
        <div className="mt-8">
          {isClientOwner && (
            <>
              <h2 className="text-2xl font-semibold text-white mb-4">Bids Received</h2>
              {acceptError && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg mb-4">{acceptError}</div>}
              <BidList
                bids={bids}
                onAccept={handleAcceptBid}
                projectStatus={isAccepting ? 'processing' : project.status}
              />
            </>
          )}

          {canFreelancerBid && (
            <BidForm
              bid={bid}
              setBid={setBid}
              onSubmit={handleBidSubmit}
              loading={submittingBid}
            />
          )}

          {project.status !== 'open' && !isClientOwner && (
            <div className="text-center text-yellow-400 bg-yellow-900/50 p-4 rounded-lg mt-8">
              This project is not open for bidding.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};