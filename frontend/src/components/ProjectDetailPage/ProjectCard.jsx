import React from "react";

const labelClass = "text-neutral-400 text-sm";
const valueClass = "text-white text-base font-medium";

const ProjectCard = ({ project }) => {
  if (!project) return null;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-sm">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h1>
        <div className="text-neutral-400 text-base">{project.short_description}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className={labelClass}>Category</div>
          <div className={valueClass}>{project.category || "-"}</div>
        </div>
        <div>
          <div className={labelClass}>Subcategory</div>
          <div className={valueClass}>{project.subcategory || "-"}</div>
        </div>
        <div>
          <div className={labelClass}>Budget</div>
          <div className={valueClass}>
            {project.budget_min && project.budget_max
              ? `$${project.budget_min} - $${project.budget_max}`
              : "-"}
          </div>
        </div>
        <div>
          <div className={labelClass}>Deadline</div>
          <div className={valueClass}>{project.deadline || "-"}</div>
        </div>
        <div>
          <div className={labelClass}>Payment Type</div>
          <div className={valueClass}>{project.payment_type || "-"}</div>
        </div>
        <div>
          <div className={labelClass}>Status</div>
          <div className="inline-block rounded px-2 py-1 text-xs font-semibold"
            style={{
              background: project.status === "cancelled" ? "#991b1b" : project.status === "in_progress" ? "#0e7490" : "#262626",
              color: "#fff"
            }}>
            {project.status}
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className={labelClass}>Description</div>
        <div className="text-white whitespace-pre-line">{project.description}</div>
      </div>
      <div className="mb-2">
        <div className={labelClass}>Skills Required</div>
        <div className="flex flex-wrap gap-2 mt-1">
          {(project.skills_required || []).map((skill, i) => (
            <span key={i} className="bg-neutral-900 text-cyan-400 px-2 py-0.5 rounded-full text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>
      {project.attachments && project.attachments.length > 0 && (
        <div className="mt-4">
          <div className={labelClass}>Attachments</div>
          <ul className="list-disc ml-6 text-cyan-400">
            {project.attachments.map((file, i) => (
              <li key={i}>
                <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="underline">
                  {file.name || file.file_url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;