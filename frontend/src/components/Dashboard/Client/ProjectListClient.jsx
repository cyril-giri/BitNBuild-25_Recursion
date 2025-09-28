
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import ProjectCardClient from './ProjectCardClient';
import { useApi } from '../../../lib/useApi';

export default function ProjectListClient() {
  const { profile } = useAuth();
  
  const { data: projects, loading, error } = useApi({
    fetchFn: () => {
      if (!profile) return { data: [], error: null };
      return supabase
        .from('projects')
        .select('*, bids(count)')
        .eq('client_id', profile.id)
        .order('created_at', { ascending: false });
    },
    deps: [profile]
  });

  if (loading) return <p className="text-neutral-400">Loading your projects...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* --- FIX: Add a '?' after projects --- */}
      {/* This safely handles the case where projects is null or undefined */}
      {projects?.map(project => (
        <ProjectCardClient key={project.id} project={project} />
      ))}
    </div>
  );
}