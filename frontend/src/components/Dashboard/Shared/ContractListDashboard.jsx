import React from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import ContractCardDashboard from './ContractCardDashboard';
import { useApi } from '../../../lib/useApi';

export default function ContractListDashboard() {
  const { profile } = useAuth();

  const { data: contracts, loading, error } = useApi({
    fetchFn: () => {
      if (!profile) return { data: [], error: null };
      return supabase
        .from('contracts')
        .select('*, project:projects(*), client:profiles!contracts_client_id_fkey(*), freelancer:profiles!contracts_freelancer_id_fkey(*), milestones(count)')
        .or(`client_id.eq.${profile.id},freelancer_id.eq.${profile.id}`)
        .order('created_at', { ascending: false });
    },
    deps: [profile]
  });

  if (loading) return <p className="text-neutral-400">Loading your contracts...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {contracts?.map(contract => (
        <ContractCardDashboard key={contract.id} contract={contract} />
      ))}
    </div>
  );
}