import React, { useState, useEffect } from 'react';

// This is a simple debounce helper to prevent firing queries on every keystroke
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function ProjectFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    paymentType: '',
    skills: '',
  });

  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500); // Debounce search input by 500ms

  useEffect(() => {
    // When the debounced search term changes, trigger the filter update
    onFilterChange({ ...filters, searchTerm: debouncedSearchTerm });
  }, [debouncedSearchTerm]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // For dropdowns, update immediately. For search, the useEffect handles it.
    if (name !== 'searchTerm') {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4">
      <input
        type="text"
        name="searchTerm"
        value={filters.searchTerm}
        onChange={handleChange}
        placeholder="Search by title or description..."
        className="flex-1 bg-neutral-800 border border-neutral-700 rounded p-2 text-sm text-white"
      />
      <select 
        name="category" 
        value={filters.category} 
        onChange={handleChange}
        className="bg-neutral-800 border border-neutral-700 rounded p-2 text-sm text-white"
      >
        <option value="">All Categories</option>
        <option value="Web Development">Web Development</option>
        <option value="Design">Design</option>
        <option value="Writing">Writing</option>
        <option value="Marketing">Marketing</option>
      </select>
      <input
        type="text"
        name="skills"
        value={filters.skills}
        onChange={handleChange}
        placeholder="Filter by skills (comma-separated)..."
        className="flex-1 bg-neutral-800 border border-neutral-700 rounded p-2 text-sm text-white"
      />
    </div>
  );
}