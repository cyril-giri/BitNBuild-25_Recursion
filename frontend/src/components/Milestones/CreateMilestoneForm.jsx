import React, { useState } from 'react';

export default function CreateMilestoneForm({ onCreateMilestone }) {
  const [form, setForm] = useState({ title: '', description: '', amount: '', due_date: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateMilestone({ ...form, amount: Number(form.amount) });
    setForm({ title: '', description: '', amount: '', due_date: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Milestone Title" className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description of work" className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm" rows="2" required />
      <div className="flex gap-3">
        <input name="amount" value={form.amount} onChange={handleChange} type="number" placeholder="Amount ($)" className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm" required />
        <input name="due_date" value={form.due_date} onChange={handleChange} type="date" className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm" required />
      </div>
      <button type="submit" className="w-full bg-cyan-500 text-black font-bold py-2 rounded">Add Milestone</button>
    </form>
  );
}