import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { useApi } from '../../lib/useApi';

export default function ClientHistory({ profileId }) {
  const { data: projects, loading } = useApi({
    fetchFn: () => supabase
      .from('projects')
      .select('*')
      .eq('client_id', profileId)
      .order('created_at', { ascending: false }),
    deps: [profileId]
  });

  if (loading) return <p className="text-neutral-400">Loading project history...</p>;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
      <h3 className="text-xl font-bold text-white">Project History</h3>
      {projects && projects.length > 0 ? (
        projects.map(project => (
          <div key={project.id} className="border-b border-neutral-800 pb-3 flex justify-between items-center">
            <div>
              <Link to={`/projects/${project.id}`} className="font-semibold text-cyan-400 hover:underline">
                {project.title}
              </Link>
              <p className="text-sm text-neutral-400">
                Budget: ${project.budget_min} - ${project.budget_max}
              </p>
            </div>
            <span className="text-xs font-semibold uppercase bg-neutral-800 text-neutral-300 px-2 py-1 rounded">
              {project.status}
            </span>
          </div>
        ))
      ) : (
        <p className="text-neutral-500">This client has not posted any projects.</p>
      )}
    </div>
  );
}