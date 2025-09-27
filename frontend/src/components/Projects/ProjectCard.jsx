import React from 'react';
import { Link } from 'react-router-dom';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

export default function ProjectCard({ project }) {
  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <Link to={`/projects/${project.id}`} className="block">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 hover:bg-neutral-800/50 transition-colors">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-xl text-white">{project.title}</h3>
          <span className="text-sm text-neutral-400">{timeSince(project.created_at)}</span>
        </div>
        <p className="text-neutral-400 text-sm mt-2 mb-4">{project.short_description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills_required?.map(skill => (
            <span key={skill} className="bg-neutral-800 text-cyan-400 px-2 py-1 rounded-full text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
        <div className="border-t border-neutral-800 pt-4 text-sm text-white font-semibold">
          <span>{formatCurrency(project.budget_min)} - {formatCurrency(project.budget_max)}</span>
        </div>
      </div>
    </Link>
  );
}