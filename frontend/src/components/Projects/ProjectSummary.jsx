import React from 'react';

const labelClass = "text-neutral-400 text-sm";
const valueClass = "text-white text-base font-medium";

export default function ProjectSummary({ project }) {
  if (!project) return null;

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

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-md">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h1>
        <p className="text-neutral-400 text-base">{project.short_description}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6 border-t border-neutral-800 pt-6">
        <div>
          <div className={labelClass}>Budget</div>
          <div className={valueClass}>
            ${project.budget_min} - ${project.budget_max}
          </div>
        </div>
        <div>
          <div className={labelClass}>Deadline</div>
          <div className={valueClass}>{new Date(project.deadline).toLocaleDateString()}</div>
        </div>
        <div>
          <div className={labelClass}>Status</div>
          <div className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getStatusClass(project.status)}`}>
            {project.status.replace('_', ' ')}
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className={labelClass}>Description</div>
        <div className="text-neutral-300 whitespace-pre-line mt-2">{project.description}</div>
      </div>
      <div className="mb-2">
        <div className={labelClass}>Skills Required</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.skills_required?.map((skill) => (
            <span key={skill} className="bg-neutral-900 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium border border-neutral-800">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};