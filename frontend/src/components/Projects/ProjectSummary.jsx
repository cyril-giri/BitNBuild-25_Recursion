import React from 'react';

// A simple utility to format currency
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '$0.00';
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ProjectSummary({ project }) {
  // Show a loading state if the project data hasn't arrived yet
  if (!project) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg w-full text-center">
        <p>Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full space-y-6">
      {/* Header Section */}
      <div className="pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-500 capitalize">{project.category} {project.subcategory && `> ${project.subcategory}`}</p>
        <h1 className="text-4xl font-bold text-gray-800 mt-1">{project.title}</h1>
        <p className="text-md text-gray-600 mt-2">{project.short_description}</p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center py-4">
        <div>
          <p className="text-sm text-gray-500">Budget</p>
          <p className="font-semibold text-lg text-gray-800">{formatCurrency(project.budget_min)} - {formatCurrency(project.budget_max)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Payment Type</p>
          <p className="font-semibold text-lg text-gray-800 capitalize">{project.payment_type}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Deadline</p>
          <p className="font-semibold text-lg text-gray-800">{new Date(project.deadline).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Location</p>
          <p className="font-semibold text-lg text-gray-800 capitalize">{project.location}</p>
        </div>
      </div>

      {/* Full Description */}
      <div className="pt-4 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Project Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{project.description}</p>
      </div>

      {/* Skills */}
      {project.skills_required && project.skills_required.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Skills Required</h2>
          <div className="flex flex-wrap gap-2">
            {project.skills_required.map(skill => (
              <span key={skill} className="bg-cyan-100 text-cyan-800 text-sm font-medium px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Attachments from the client */}
      {project.attachments && project.attachments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Client Attachments</h2>
          <ul className="list-disc list-inside space-y-1">
            {project.attachments.map((file, index) => (
              <li key={index}>
                <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline hover:text-cyan-800 transition-colors">
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}