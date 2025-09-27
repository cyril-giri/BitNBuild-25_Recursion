import React from 'react';

export default function ProjectBudgetInput({ form, handleChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        name="budget_min"
        value={form.budget_min}
        onChange={handleChange}
        placeholder="Budget Min ($)"
        type="number"
        min={0}
        className="border p-2 w-full rounded"
        required
      />
      <input
        name="budget_max"
        value={form.budget_max}
        onChange={handleChange}
        placeholder="Budget Max ($)"
        type="number"
        min={0}
        className="border p-2 w-full rounded"
        required
      />
      <select
        name="payment_type"
        value={form.payment_type}
        onChange={handleChange}
        className="border p-2 w-full rounded bg-white"
      >
        <option value="fixed">Fixed Price</option>
        <option value="hourly">Hourly Rate</option>
      </select>
    </div>
  );
}