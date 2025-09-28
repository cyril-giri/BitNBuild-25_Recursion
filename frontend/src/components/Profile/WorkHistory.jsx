
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { useApi } from '../../lib/useApi';

export default function WorkHistory({ profileId }) {
  const { data: contracts, loading } = useApi({
    fetchFn: () => supabase
      .from('contracts')
      .select('*, project:projects(*), client:profiles!contracts_client_id_fkey(*)')
      .eq('freelancer_id', profileId)
      .eq('status', 'completed'),
    deps: [profileId]
  });

  if (loading) return <p className="text-neutral-400">Loading work history...</p>;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
      <h3 className="text-xl font-bold text-white">Completed Work</h3>
      {contracts && contracts.length > 0 ? (
        contracts.map(contract => (
          <div key={contract.id} className="border-b border-neutral-800 pb-3">
            <Link to={`/contracts/${contract.id}`} className="font-semibold text-cyan-400 hover:underline">
              {contract.project.title}
            </Link>
            <p className="text-sm text-neutral-400">
              Client: {contract.client.full_name}
            </p>
            <p className="text-xs text-neutral-500">
              Completed on: {new Date(contract.end_date || contract.created_at).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-neutral-500">No completed contracts to show.</p>
      )}
    </div>
  );
}