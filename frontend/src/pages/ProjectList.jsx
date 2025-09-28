import React from 'react';

import { supabase } from '../lib/supabaseClient';
import ProjectCard from '../components/Projects/ProjectCard';
import LoggedInNavbar from '../components/LoggedInNavbar'; // Assuming you have this
import { useApi } from '../lib/useApi';

export default function ProjectList() {
  const { data: projects, loading, error } = useApi({
    fetchFn: () => supabase
      .from('projects')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false }),
  });

  return (
    <div className="bg-neutral-950 min-h-screen text-white">
      <LoggedInNavbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Browse Open Projects</h1>
        {loading && <p>Loading projects...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        <div className="space-y-4">
          {projects?.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}