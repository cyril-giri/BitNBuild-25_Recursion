import React from 'react';
import { Link } from 'react-router-dom';

const getStatusClass = (status) => {
  switch (status) {
    case 'open': return 'bg-green-800 text-green-200';
    case 'awarded':
    case 'in_progress': return 'bg-cyan-800 text-cyan-200';
    case 'cancelled': return 'bg-red-900 text-red-200';
    case 'completed': return 'bg-blue-800 text-blue-200';
    default: return 'bg-neutral-800 text-neutral-300';
  }
};

export default function ProjectCardClient({ project }) {
  const bidCount = project.bids[0]?.count || 0;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-white pr-4">{project.title}</h3>
          <span className={`flex-shrink-0 text-xs font-semibold capitalize px-2 py-1 rounded ${getStatusClass(project.status)}`}>
            {project.status.replace('_', ' ')}
          </span>
        </div>
        <p className="text-sm text-neutral-400 mt-2">{project.short_description}</p>
        {project.status === 'open' && (
          <p className="text-sm font-semibold text-cyan-400 mt-3">{bidCount} Bids Received</p>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-neutral-800">
        <Link to={`/projects/${project.id}`} className="w-full text-center block bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          View Project & Bids
        </Link>
      </div>
    </div>
  );
}