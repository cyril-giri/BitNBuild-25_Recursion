import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

// Import Child Components
import ContractOverview from '../components/Contracts/ContractOverview';
import ChatBox from '../components/Chat/ChatBox'; // Assuming this exists from previous steps
import { useApi } from '../lib/useApi';
import MilestoneList from '../components/Milestones/MilstoneList';
import DeliverablesList from '../components/Deliverables/DeliverablesList';

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

  // Fetch all deliverables for this contract (flat list)
  const { data: deliverables, loading: loadingDeliverables, refetch: refetchDeliverables } = useApi({
    fetchFn: () => supabase
      .from('deliverables')
      .select('*')
      .in('milestone_id', (milestones || []).map(m => m.id))
      .order('created_at', { ascending: true }),
    deps: [milestones?.map(m => m.id).join(",")], // refetch when milestones change
    manual: !milestones || milestones.length === 0, // only run when milestones are loaded
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
  
  // Submit a new deliverable (Freelancer)
  const handleSubmitDeliverable = async (deliverableData) => {
    // Find the first funded milestone for this contract
    const fundedMilestone = (milestones || []).find(m => m.status === "funded");
    if (!fundedMilestone) {
      alert("No funded milestone available to submit deliverable.");
      return;
    }
    const { error } = await supabase.from('deliverables').insert([{
      ...deliverableData,
      milestone_id: fundedMilestone.id,
      freelancer_id: profile.id,
    }]);
    if (error) {
      alert("Error submitting deliverable: " + error.message);
    } else {
      refetchDeliverables();
      refetchMilestones();
    }
  };
  
  // Accept a deliverable (Client)
  const handleAcceptDeliverable = async (deliverable) => {
    // 1. Update deliverable status
    const { error: deliverableError } = await supabase
      .from('deliverables')
      .update({ status: "accepted" })
      .eq('id', deliverable.id);
    // 2. Update milestone status
    const { error: milestoneError } = await supabase
      .from('milestones')
      .update({ status: "accepted" })
      .eq('id', deliverable.milestone_id);

    if (deliverableError || milestoneError) {
      alert("Error accepting deliverable.");
    } else {
      refetchDeliverables();
      refetchMilestones();
    }
  };

  // Request revision (Client)
  const handleRequestRevision = async (deliverable) => {
    const { error } = await supabase
      .from('deliverables')
      .update({ status: "revision_requested" })
      .eq('id', deliverable.id);
    if (error) {
      alert("Error requesting revision: " + error.message);
    } else {
      refetchDeliverables();
    }
  };

  // Resubmit deliverable (Freelancer)
  const handleResubmitDeliverable = (deliverable) => {
    // Open the submit modal, optionally pre-fill notes, etc.
    // You can enhance this as needed.
    alert("Please use the Add Deliverable button to resubmit your work.");
  };

  // Placeholder for funding a milestone (Client action)
  const handleFundMilestone = async (milestoneId) => {
    const { error } = await supabase
      .from('milestones')
      .update({ status: "funded" })
      .eq('id', milestoneId);

    if (error) {
      alert("Error funding milestone: " + error.message);
    } else {
      alert("Milestone funded!");
      refetchMilestones();
    }
  };
  
  // Placeholder for approving work (Client action)
  const handleApproveWork = async (milestoneId) => {
    // This logic would involve releasing escrow and updating milestone status.
    console.log("Approving work for milestone:", milestoneId);
    alert("Work approved and payment released! (Placeholder)");
  };


  const isLoading = loadingContract || loadingMilestones || loadingDeliverables;
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
          <DeliverablesList
            deliverables={deliverables || []}
            role={role}
            onAccept={handleAcceptDeliverable}
            onRequestRevision={handleRequestRevision}
            onResubmit={handleResubmitDeliverable}
            onSubmitDeliverable={handleSubmitDeliverable}
            loading={loadingDeliverables}
            milestones={milestones || []}
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