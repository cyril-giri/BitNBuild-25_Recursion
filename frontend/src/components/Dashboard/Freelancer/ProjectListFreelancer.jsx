import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import ProjectCard from '../../../components/Projects/ProjectCard';
import ProjectFilters from '../Shared/ProjectFilters'; // <-- Import the new component
import { useApi } from '../../../lib/useApi';

export default function ProjectListFreelancer() {
  // 1. Add state to hold the current filters
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    skills: '',
  });

  // 2. Update the useApi hook to use the filters state
  const { data: projects, loading, error } = useApi({
    fetchFn: () => {
      // 3. Build the query dynamically based on filters
      let query = supabase
        .from('projects')
        .select('*')
        .eq('status', 'open');

      // Add search filter for title or description
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      // Add category filter
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      // Add skills filter (using the 'contains' operator for arrays)
      if (filters.skills) {
        const skillsArray = filters.skills.split(',').map(s => s.trim()).filter(Boolean);
        if (skillsArray.length > 0) {
          query = query.contains('skills_required', skillsArray);
        }
      }

      // Add ordering and limits
      query = query.order('created_at', { ascending: false }).limit(20);

      return query;
    },
    // 4. Re-run the API call whenever the filters change
    deps: [filters]
  });

  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div>
      {/* 5. Render the filters component */}
      <ProjectFilters onFilterChange={setFilters} />

      {loading && <p className="text-neutral-400">Loading available projects...</p>}
      
      {!loading && projects?.length === 0 && (
         <div className="text-center py-12 border border-dashed border-neutral-700 rounded-lg">
           <p className="text-neutral-400">No projects match your current filters.</p>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}