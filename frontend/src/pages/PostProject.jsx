import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// Import the new components
import ProjectDetailsInput from "../components/Projects/ProjectDetailsInput";
import ProjectBudgetInput from "../components/Projects/ProjectBudgetInput";
import ProjectMetadataInput from "../components/Projects/ProjectMetadataInput";
import AttachmentUploader from "../components/Projects/AttachmentUploader";

export default function PostProject() {
  const { profile, role } = useAuth();
  const navigate = useNavigate();

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
    skills_required: "",
    location: "",
    visibility: "public",
    attachments: [], // Manages the JSONB array
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simple guard for non-clients
  if (role && role !== "client") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p>Only clients can post new projects.</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 bg-cyan-500 text-white py-2 px-4 rounded">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const setAttachments = (newAttachments) => {
     setForm(f => ({ ...f, attachments: newAttachments }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) {
      setError("You must be logged in to post a project.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const projectData = {
        client_id: profile.id, // Get client_id from the Auth context's profile
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
        visibility: form.visibility,
        attachments: form.attachments,
      };

      const { error: insertError } = await supabase.from("projects").insert([projectData]);
      if (insertError) throw insertError;
      
      alert("Project posted successfully!");
      navigate("/dashboard");

    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Post a New Project</h2>
        
        <ProjectDetailsInput form={form} handleChange={handleChange} />
        <ProjectBudgetInput form={form} handleChange={handleChange} />
        <ProjectMetadataInput form={form} handleChange={handleChange} />
        <AttachmentUploader attachments={form.attachments} setAttachments={setAttachments} />
        
        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}
        
        <button
          type="submit"
          className="bg-cyan-500 text-white font-bold py-3 w-full rounded hover:bg-cyan-600 transition-colors duration-300 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Project"}
        </button>
      </form>
    </div>
  );
}