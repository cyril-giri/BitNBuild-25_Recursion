import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

// Import the new components we will create
import ContractOverview from '../components/Contracts/ContractOverview';

import ChatBox from '../components/Chat/ChatBox';
import { useApi } from '../lib/useApi';
import MilestoneList from '../components/Milestones/MilstoneList';

export default function ContractWorkspace() {
  const { id } = useParams(); // This is the contract_id from the URL
  const { profile, role } = useAuth();

  // Fetch the core contract data, joining project and profile details
  const { data: contract, loading: loadingContract, error: errorContract } = useApi({
    fetchFn: () => supabase
      .from('contracts')
      .select('*, project:projects(*), client:profiles!contracts_client_id_fkey(*), freelancer:profiles!contracts_freelancer_id_fkey(*)')
      .eq('id', id)
      .single(),
    deps: [id]
  });

  // Fetch all milestones for this contract, along with their deliverables
  const { data: milestones, loading: loadingMilestones, refetch: refetchMilestones } = useApi({
    fetchFn: () => supabase
      .from('milestones')
      .select('*, deliverables(*)')
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
  
  // Handler for submitting a deliverable (Freelancer action)
  const handleSubmitDeliverable = async (deliverableData) => {
    const { milestone_id, notes, attachments } = deliverableData;

    try {
      // 1. Insert the deliverable record
      const { data: newDeliverable, error: deliverableError } = await supabase
        .from('deliverables')
        .insert([{
          milestone_id,
          freelancer_id: profile.id,
          notes,
          file_url: attachments[0]?.file_url || null, // Assuming one file for simplicity
        }])
        .select()
        .single();
      
      if (deliverableError) throw deliverableError;

      // 2. Update the milestone status to 'delivered'
      const { error: milestoneError } = await supabase
        .from('milestones')
        .update({ status: 'delivered' })
        .eq('id', milestone_id);

      if (milestoneError) throw milestoneError;
      
      alert('Deliverable submitted successfully!');
      refetchMilestones();

    } catch (error) {
      alert("Error submitting deliverable: " + error.message);
    }
  };

  const isLoading = loadingContract || loadingMilestones;
  if (isLoading) return <div className="text-center text-white mt-20">Loading Workspace...</div>;
  if (errorContract || !contract) return <div className="text-center text-red-500 mt-20">Contract not found.</div>;

  return (
    <div className="bg-neutral-950 min-h-screen text-white">
      <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area for contract and milestones */}
        <div className="lg:col-span-2 space-y-8">
          <ContractOverview contract={contract} />
          <MilestoneList 
            milestones={milestones || []} 
            role={role}
            contractId={id}
            onCreateMilestone={handleCreateMilestone}
            onSubmitDeliverable={handleSubmitDeliverable}
            isClient={profile?.id === contract.client.id}
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