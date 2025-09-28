import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DeliverableCard from '../components/Deliverables/DeliverableCard';
import UploadDeliverablePanel from '../components/Deliverables/UploadDeliverablePanel';

export default function Deliverables() {
  const { id: contractId } = useParams();
  const { profile, role } = useAuth();
  
  const { data, loading, error, refetch } = useApi({
    fetchFn: async () => {
      // Fetching logic remains the same
      const { data: contractData, error: contractError } = await supabase.from('contracts').select('*, project:projects(*)').eq('id', contractId).single();
      if (contractError) throw contractError;
      const { data: milestonesData, error: milestonesError } = await supabase.from('milestones').select('*, deliverables(*)').eq('contract_id', contractId).order('order_no');
      if (milestonesError) throw milestonesError;
      return { contract: contractData, milestones: milestonesData };
    },
    deps: [contractId]
  });

  const { contract, milestones } = data || {};

  // This handler now only inserts the data provided by the frontend
  const handleUpload = async (uploadData) => {
    const { error } = await supabase.from('deliverables').insert([{
      milestone_id: uploadData.milestone_id,
      freelancer_id: profile.id,
      notes: uploadData.notes,
      file_url: uploadData.file_url,
      hash: uploadData.hash
      // preview_url is intentionally omitted; the backend will add it.
    }]);

    if (error) {
      alert("Error submitting deliverable: " + error.message);
    } else {
      alert("Deliverable uploaded successfully! A preview is being generated.");
      // Add a small delay to give the backend function time to run before refetching
      setTimeout(() => refetch(), 2000);
    }
  };

  // ... (handleAccept and handleRequestRevision functions remain the same)

  const isClient = role === 'client';
  const isFreelancer = role === 'freelancer';

  if (loading) return <div className="text-center text-white mt-20">Loading Deliverables...</div>;
  if (error) return <div className="text-center text-red-500 mt-20">{error.message}</div>;

  return (
    <div className="bg-neutral-950 min-h-screen text-white">
      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* ... (Header JSX remains the same) ... */}
        
        {milestones?.map(milestone => (
          <section key={milestone.id} className="mb-8">
            <h2 className="text-xl font-semibold border-b border-neutral-800 pb-2 mb-4">Milestone: {milestone.title}</h2>
            <div className="space-y-4">
              {milestone.deliverables.length > 0 ? (
                milestone.deliverables.map(d => 
                  <DeliverableCard
                    key={d.id}
                    deliverable={d}
                    isClient={isClient}
                    // ... pass handlers
                  />)
              ) : (
                <p className="text-sm text-neutral-500">No deliverables submitted for this milestone yet.</p>
              )}
            </div>
            {isFreelancer && milestone.status === 'funded' && (
              <div className="mt-6">
                <UploadDeliverablePanel 
                  milestoneId={milestone.id} 
                  onUploadSuccess={(data) => handleUpload({ ...data, milestone_id: milestone.id })}
                />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}