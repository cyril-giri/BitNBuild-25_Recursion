import React from 'react';

import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import ContractCard from '../components/Contracts/ContractCard';
import LoggedInNavbar from '../components/LoggedInNavbar'; // Assuming you have a logged-in navbar
import { useApi } from '../lib/useApi';

export default function ContractList() {
  const { profile } = useAuth();
  
  // This hook fetches all contracts where the current user is either the client or the freelancer.
  // It also joins the related project and profile data needed for display.
  const { data: contracts, loading, error } = useApi({
    fetchFn: () => {
      // Don't run the query until the user's profile is loaded
      if (!profile) return { data: [], error: null };
      
      return supabase
        .from('contracts')
        .select('*, project:projects(*), client:profiles!contracts_client_id_fkey(*), freelancer:profiles!contracts_freelancer_id_fkey(*)')
        .or(`client_id.eq.${profile.id},freelancer_id.eq.${profile.id}`)
        .order('created_at', { ascending: false });
    },
    deps: [profile] // Re-run the query when the profile is available
  });

  return (
    <div className="bg-neutral-950 min-h-screen text-white">
      <LoggedInNavbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">My Contracts</h1>
        
        {loading && <p className="text-neutral-400">Loading your contracts...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}

        <div className="space-y-4">
          {contracts?.map(contract => (
            <ContractCard key={contract.id} contract={contract} currentUserId={profile.id} />
          ))}

          {!loading && contracts?.length === 0 && (
            <div className="text-center py-12 border border-dashed border-neutral-700 rounded-lg">
              <p className="text-neutral-400">You have no active or past contracts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}