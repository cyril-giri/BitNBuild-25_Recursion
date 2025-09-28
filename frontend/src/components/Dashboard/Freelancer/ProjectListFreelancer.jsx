import React from 'react';
import { supabase } from '../../../lib/supabaseClient';
import ProjectCard from '../../../components/Projects/ProjectCard'; // Reusing the public project card
import { useApi } from '../../../lib/useApi';

export default function ProjectListFreelancer() {
  const { data: projects, loading, error } = useApi({
    fetchFn: () => supabase
      .from('projects')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(6), // Show a limited number on the dashboard
  });

  if (loading) return <p className="text-neutral-400">Loading available projects...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects?.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}