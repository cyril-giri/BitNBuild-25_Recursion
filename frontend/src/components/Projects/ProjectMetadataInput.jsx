import React from 'react';

export default function ProjectMetadataInput({ form, handleChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category (e.g., 'Web Development')"
          className="border p-2 w-full rounded"
        />
        <input
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          placeholder="Subcategory (e.g., 'React')"
          className="border p-2 w-full rounded"
        />
      </div>
      <input
        name="skills_required"
        value={form.skills_required}
        onChange={handleChange}
        placeholder="Required Skills (comma-separated, e.g., React, CSS, Supabase)"
        className="border p-2 w-full rounded"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location (e.g., 'Remote', 'Campus')"
          className="border p-2 w-full rounded"
        />
        <select
          name="visibility"
          value={form.visibility}
          onChange={handleChange}
          className="border p-2 w-full rounded bg-white"
        >
          <option value="public">Public</option>
          <option value="campus-only">Campus Only</option>
        </select>
      </div>
       <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Project Deadline</label>
          <input
            id="deadline"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            type="date"
            className="border p-2 w-full rounded"
            required
          />
       </div>
    </div>
  );
}