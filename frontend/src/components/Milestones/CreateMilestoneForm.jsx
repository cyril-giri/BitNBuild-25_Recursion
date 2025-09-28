import React, { useState } from 'react';

export default function CreateMilestoneForm({ onCreateMilestone }) {
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    amount: '', 
    due_date: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // The order_no would typically be calculated based on existing milestones
    await onCreateMilestone({ ...form, amount: Number(form.amount) });
    setForm({ title: '', description: '', amount: '', due_date: '' });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input 
        name="title" 
        value={form.title} 
        onChange={handleChange} 
        placeholder="Milestone Title" 
        className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm text-white focus:ring-cyan-500 focus:border-cyan-500" 
        required 
      />
      <textarea 
        name="description" 
        value={form.description} 
        onChange={handleChange} 
        placeholder="Description of work for this milestone" 
        className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm text-white focus:ring-cyan-500 focus:border-cyan-500" 
        rows="2" 
        required 
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          name="amount" 
          value={form.amount} 
          onChange={handleChange} 
          type="number" 
          placeholder="Amount ($)" 
          className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm text-white focus:ring-cyan-500 focus:border-cyan-500" 
          required 
        />
        <input 
          name="due_date" 
          value={form.due_date} 
          onChange={handleChange} 
          type="date" 
          className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm text-white focus:ring-cyan-500 focus:border-cyan-500" 
          required 
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-cyan-500 text-black font-bold py-2 rounded hover:bg-cyan-400 disabled:bg-neutral-700 transition-colors"
      >
        {loading ? 'Adding...' : 'Add Milestone'}
      </button>
    </form>
  );
}