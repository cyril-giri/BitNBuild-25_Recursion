import React from 'react';

export default function ProjectDetailsInput({ form, handleChange }) {
  return (
    <div className="space-y-4">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Project Title (e.g., 'Build a React Landing Page')"
        className="border p-2 w-full rounded"
        required
      />
      <input
        name="short_description"
        value={form.short_description}
        onChange={handleChange}
        placeholder="Short Description (One-liner)"
        className="border p-2 w-full rounded"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Full Project Description (include goals, requirements, etc.)"
        className="border p-2 w-full rounded"
        rows={5}
        required
      />
    </div>
  );
}