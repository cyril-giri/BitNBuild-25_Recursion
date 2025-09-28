import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

// Import Child Components
import ContractOverview from '../components/Contracts/ContractOverview';
import ChatBox from '../components/Chat/ChatBox'; // Assuming this exists from previous steps
import { useApi } from '../lib/useApi';
import MilestoneList from '../components/Milestones/MilstoneList';

export default function ContractWorkspace() {
  const { id } = useParams(); // This is the contract_id from the URL
  const { profile, role } = useAuth();

  // Fetch the core contract data, joining project and profile details in one go
  const { data: contract, loading: loadingContract, error: errorContract } = useApi({
    fetchFn: () => supabase
      .from('contracts')
      .select('*, project:projects(*), client:profiles!contracts_client_id_fkey(*), freelancer:profiles!contracts_freelancer_id_fkey(*)')
      .eq('id', id)
      .single(),
    deps: [id]
  });

  // Fetch all milestones for this contract
  const { data: milestones, loading: loadingMilestones, refetch: refetchMilestones } = useApi({
    fetchFn: () => supabase
      .from('milestones')
      .select('*, deliverables(*)') // Also fetch any related deliverables
      .eq('contract_id', id)
      .order('order_no', { ascending: true }),
    deps: [id]
  });

  // Handler for creating a new milestone (Client action)
  const handleCreateMilestone = async (milestoneData) => {
    const { error } = await supabase.from('milestones').insert([{ contract_id: id, ...milestoneData }]);
    if (error) {
      alert("Error creating milestone: " + error.message);
    } else {
      alert("Milestone created successfully!");
      refetchMilestones();
    }
  };
  
  // Placeholder for submitting a deliverable (Freelancer action)
  const handleSubmitDeliverable = async (deliverableData) => {
    // This logic would involve inserting into the 'deliverables' table
    // and updating the milestone status to 'delivered'.
    console.log("Submitting deliverable:", deliverableData);
    alert("Deliverable submitted! (Placeholder)");
    refetchMilestones();
  };
  
  // Placeholder for funding a milestone (Client action)
  const handleFundMilestone = async (milestoneId) => {
    // This logic would involve Stripe/escrow and updating milestone status.
    console.log("Funding milestone:", milestoneId);
    alert("Milestone funded! (Placeholder)");
  };
  
  // Placeholder for approving work (Client action)
  const handleApproveWork = async (milestoneId) => {
    // This logic would involve releasing escrow and updating milestone status.
    console.log("Approving work for milestone:", milestoneId);
    alert("Work approved and payment released! (Placeholder)");
  };


  const isLoading = loadingContract || loadingMilestones;
  if (isLoading) return <div className="text-center text-white mt-20">Loading Workspace...</div>;
  if (errorContract || !contract) return <div className="text-center text-red-500 mt-20">Contract not found or an error occurred.</div>;

  return (
    <div className="bg-neutral-950 min-h-screen text-white">
      <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area for contract and milestones */}
        <div className="lg:col-span-2 space-y-8">
          <ContractOverview contract={contract} milestones={milestones || []} />
          <MilestoneList 
            milestones={milestones || []} 
            role={role}
            isClient={profile?.id === contract.client.id}
            onCreateMilestone={handleCreateMilestone}
            onFundMilestone={handleFundMilestone}
            onSubmitDeliverable={handleSubmitDeliverable}
            onApproveWork={handleApproveWork}
          />
        </div>

        {/* Sidebar for real-time messaging */}
        <div className="lg:col-span-1">
          <ChatBox contractId={id} currentUserProfile={profile} />
        </div>
      </div>
    </div>
  );
}