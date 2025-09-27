// src/components/Register/EducationInput.jsx
import React from 'react';

export default function EducationInput({ education, setEducation }) {
  const handleAdd = () => {
    setEducation([
      ...education,
      { degree: '', institution: '', year: new Date().getFullYear().toString() },
    ]);
  };

  const handleChange = (index, field, value) => {
    const newEducation = education.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setEducation(newEducation);
  };

  const handleRemove = index => {
    setEducation(education.filter((_, i) => i !== index));
  };

  return (
    <div className="w-64 mb-4 border p-2 rounded">
      <h3 className="font-semibold mb-2">Education</h3>
      {education.map((item, index) => (
        <div key={index} className="space-y-1 mb-2 p-1 border-b">
          <input
            type="text"
            placeholder="Degree/Major"
            value={item.degree}
            onChange={e => handleChange(index, 'degree', e.target.value)}
            className="border p-1 w-full text-sm"
          />
          <input
            type="text"
            placeholder="Institution"
            value={item.institution}
            onChange={e => handleChange(index, 'institution', e.target.value)}
            className="border p-1 w-full text-sm"
          />
          <input
            type="number"
            placeholder="Year"
            value={item.year}
            onChange={e => handleChange(index, 'year', e.target.value)}
            className="border p-1 w-full text-sm"
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="bg-green-500 text-white p-1 text-sm rounded w-full"
      >
        + Add Education
      </button>
    </div>
  );
}