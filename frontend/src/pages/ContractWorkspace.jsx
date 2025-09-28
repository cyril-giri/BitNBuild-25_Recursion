import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import ContractOverview from "../components/Contracts/ContractOverview";
import ChatInterface from "../components/Chat/ChatInterface";
import LeaveReviewPrompt from "../components/Reviews/LeaveReviewPrompt";
import { useApi } from "../lib/useApi";
import MilestoneList from "../components/Milestones/MilstoneList";
import Tabs from "../components/Dashboard/Shared/Tabs";
// <-- FIX: Corrected typo from "MilstoneList"


export default function ContractWorkspace() {
  const { id: contractId } = useParams();
  const { profile, role } = useAuth();
  const [activeTab, setActiveTab] = useState("Milestones");

  const { data, loading, error, refetch } = useApi({
    fetchFn: async () => {
      const { data: contractData, error: contractError } = await supabase
        .from("contracts")
        .select("*, project:projects(*), client:profiles!contracts_client_id_fkey(*), freelancer:profiles!contracts_freelancer_id_fkey(*)")
        .eq("id", contractId)
        .single();
      if (contractError) throw contractError;

      const { data: milestonesData, error: milestonesError } = await supabase
        .from("milestones")
        .select("*, escrow(*), deliverables(*)")
        .eq("contract_id", contractId)
        .order("order_no");
      if (milestonesError) throw milestonesError;

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("contract_id", contractId);
      if (reviewsError) throw reviewsError;

      return { contract: contractData, milestones: milestonesData, reviews: reviewsData };
    },
    deps: [contractId],
  });

  const { contract, milestones, reviews } = data || {};

  const handleCreateMilestone = async (milestoneData) => {
    const { error } = await supabase.from('milestones').insert([{ contract_id: contractId, ...milestoneData }]);
    if (error) {
      alert("Error creating milestone: " + error.message);
    } else {
      alert("Milestone created successfully!");
      refetch();
    }
  };

  const handleFundMilestone = async (milestoneId) => {
    if (window.confirm("Are you sure you want to fund this milestone?")) {
      const { error } = await supabase.rpc('fund_milestone', { p_milestone_id: milestoneId });
      if (error) alert("Error funding milestone: " + error.message);
      else {
        alert("Milestone funded successfully!");
        refetch();
      }
    }
  };
  
  const handleSubmitDeliverable = async (deliverableData) => {
    const { milestone_id, notes, attachments } = deliverableData;
    const { error } = await supabase.rpc('submit_deliverable', {
      p_milestone_id: milestone_id,
      p_freelancer_id: profile.id,
      p_notes: notes,
      p_file_url: attachments[0]?.file_url || null,
      p_hash: attachments[0]?.hash || null // <-- FIX: Ensure hash is passed to the function
    });

    if (error) alert("Error submitting deliverable: " + error.message);
    else {
      alert('Deliverable submitted successfully!');
      refetch();
    }
  };

  const handleApproveWork = async (milestoneId) => {
    if (window.confirm("Approve this deliverable? This will release payment.")) {
      const { error } = await supabase.rpc('client_approve_milestone', { p_milestone_id: milestoneId });
      if (error) alert("Error: " + error.message);
      else {
        alert("Work approved and payment released!");
        refetch();
      }
    }
  };

  const handleRejectWork = async (milestoneId) => {
    if (window.confirm("Reject this deliverable? This will request a revision.")) {
      const { error } = await supabase.rpc('client_reject_milestone', { p_milestone_id: milestoneId });
      if (error) alert("Error: " + error.message);
      else {
        alert("Revision requested.");
        refetch();
      }
    }
  };
  
  const handleFreelancerCancel = async (milestoneId) => {
     if (window.confirm("Cancel this milestone? Funds will be returned to the client.")) {
      const { error } = await supabase.rpc('freelancer_cancel_milestone', { p_milestone_id: milestoneId });
      if (error) alert("Error: " + error.message);
      else {
        alert("Milestone cancelled and funds returned.");
        refetch();
      }
    }
  };
  
  const handleEndContract = async () => {
    if (window.confirm("Are you sure you want to mark this contract as complete?")) {
        const { error } = await supabase.from('contracts').update({ status: 'completed', end_date: new Date().toISOString() }).eq('id', contractId);
        if (error) alert("Error completing contract: " + error.message);
        else {
            alert("Contract marked as complete!");
            refetch();
        }
    }
  };

  if (loading || !profile) return <div className="text-center text-white mt-20">Loading Workspace...</div>;
  if (error || !contract) return <div className="text-center text-red-500 mt-20">Error loading contract data.</div>;

  const isClient = profile.id === contract.client.id;
  const hasUserReviewed = reviews?.some((r) => r.from_id === profile.id);

  return (
    <div className="bg-neutral-950 min-h-screen text-white">
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        {contract.status === "completed" && (
          <LeaveReviewPrompt contractId={contract.id} hasUserReviewed={hasUserReviewed} />
        )}

        <ContractOverview contract={contract} milestones={milestones || []} />

        <div>
          <Tabs
            tabs={["Milestones", "Messages"]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="mt-6">
            {activeTab === "Milestones" && (
              <MilestoneList
                milestones={milestones || []}
                isClient={isClient}
                role={role}
                onCreateMilestone={handleCreateMilestone}
                onFundMilestone={handleFundMilestone}
                onSubmitDeliverable={handleSubmitDeliverable}
                onApproveWork={handleApproveWork}
                onRejectWork={handleRejectWork}
                onFreelancerCancel={handleFreelancerCancel}
              />
            )}
            {activeTab === "Messages" && (
              <div className="h-[70vh] rounded-lg border border-neutral-800 overflow-hidden">
                <ChatInterface initialContractId={contractId} />
              </div>
            )}
          </div>
        </div>

        {isClient && contract.status === "active" && (
          <div className="text-right">
            <button
              onClick={handleEndContract}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Mark Contract as Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}