import React, { useState } from "react";
import { useApi } from "../lib/useApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function PostProject() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  // Only allow clients
  if (role !== "client") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded shadow text-black">
          Only clients can post projects.
        </div>
      </div>
    );
  }

  const [form, setForm] = useState({
    title: "",
    short_description: "",
    description: "",
    category: "",
    subcategory: "",
    budget_min: "",
    budget_max: "",
    payment_type: "fixed",
    deadline: "",
    deliverables: "",
    skills_required: "",
    location: "",
    bidding_deadline: "",
    preferred_yoe: "",
  });

  // useApi for posting project
  const {
    loading,
    error,
    isSuccess,
    refetch: postProject,
  } = useApi({
    fetchFn: async () => {
      // Prepare data for Supabase
      const projectData = {
        client_id: user.id,
        title: form.title,
        short_description: form.short_description,
        description: form.description,
        category: form.category,
        subcategory: form.subcategory,
        budget_min: Number(form.budget_min),
        budget_max: Number(form.budget_max),
        payment_type: form.payment_type,
        deadline: form.deadline,
        skills_required: form.skills_required.split(",").map((s) => s.trim()),
        location: form.location,
        // Optional fields:
        // deliverables, bidding_deadline, preferred_yoe
      };
      const { error } = await supabase.from("projects").insert([projectData]);
      if (error) throw error;
      return { success: true };
    },
    deps: [], // Only run on demand
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await postProject();
    if (!error && result?.success) {
      alert("Project posted!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl space-y-4"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-black">Post a New Project</h2>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Project Title"
          className="border p-2 w-full"
          required
        />
        <input
          name="short_description"
          value={form.short_description}
          onChange={handleChange}
          placeholder="Short Description"
          className="border p-2 w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Full Description"
          className="border p-2 w-full"
          rows={4}
          required
        />
        <div className="flex gap-2">
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 w-full"
          />
          <input
            name="subcategory"
            value={form.subcategory}
            onChange={handleChange}
            placeholder="Subcategory"
            className="border p-2 w-full"
          />
        </div>
        <div className="flex gap-2">
          <input
            name="budget_min"
            value={form.budget_min}
            onChange={handleChange}
            placeholder="Budget Min"
            type="number"
            min={0}
            className="border p-2 w-full"
            required
          />
          <input
            name="budget_max"
            value={form.budget_max}
            onChange={handleChange}
            placeholder="Budget Max"
            type="number"
            min={0}
            className="border p-2 w-full"
            required
          />
        </div>
        <select
          name="payment_type"
          value={form.payment_type}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="fixed">Fixed</option>
          <option value="hourly">Hourly</option>
        </select>
        <input
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          placeholder="Project Deadline"
          type="date"
          className="border p-2 w-full"
          required
        />
        <input
          name="skills_required"
          value={form.skills_required}
          onChange={handleChange}
          placeholder="Required Skills (comma separated)"
          className="border p-2 w-full"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-2 w-full"
        />
        {/* Optional fields */}
        <input
          name="bidding_deadline"
          value={form.bidding_deadline}
          onChange={handleChange}
          placeholder="Bidding Deadline"
          type="date"
          className="border p-2 w-full"
        />
        <input
          name="preferred_yoe"
          value={form.preferred_yoe}
          onChange={handleChange}
          placeholder="Preferred Years of Experience"
          type="number"
          min={0}
          className="border p-2 w-full"
        />
        {error && (
          <div className="text-red-500 text-sm">{error.message}</div>
        )}
        <button
          type="submit"
          className="bg-cyan-400 text-black font-semibold p-2 w-full rounded hover:bg-cyan-300 transition"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Project"}
        </button>
      </form>
    </div>
  );
}

export default PostProject;