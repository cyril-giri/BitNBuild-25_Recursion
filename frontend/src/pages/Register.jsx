// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import EducationInput from "../components/Register/EducationInput";
import AvatarUploader from "../components/Register/AvatarUploader";

const ALL_SKILLS = [
  "Frontend", "Backend", "Fullstack", "Design", "Writing",
  "Mobile Dev", "Data Science", "Marketing", "SEO"
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: "freelancer",
    headline: "",
    bio: "",
    selected_skills: [],
    education: [],
    avatarFile: null, // store file temporarily
    avatar_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSkillChange = skill => {
    setForm(f => ({
      ...f,
      selected_skills: f.selected_skills.includes(skill)
        ? f.selected_skills.filter(s => s !== skill)
        : [...f.selected_skills, skill],
    }));
  };

  const handleAvatarSelect = file => {
    setForm(f => ({ ...f, avatarFile: file }));
  };

  const handleRegister = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Sign up user
      const password = form.password || Math.random().toString(36).substring(2);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password,
        options: { data: { full_name: form.full_name } }
      });
      if (authError) throw authError;
      const user = authData.user;
      if (!user) throw new Error("User creation failed");

      // 2️⃣ Insert profile
      const { error: profileError } = await supabase.from('profiles').insert([{
        user_id: user.id,
        role: form.role,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        headline: form.headline,
        bio: form.bio,
        skills: form.role === "freelancer" ? form.selected_skills : [],
        education: form.education,
        avatar_url: "", // placeholder
      }]);
      if (profileError) throw profileError;

      // 3️⃣ Upload avatar AFTER profile exists
      let avatar_url = "";
      if (form.avatarFile) {
        const fileExt = form.avatarFile.name.split('.').pop();
        const filePath = `avatars/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, form.avatarFile);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        avatar_url = publicData.publicUrl;

        // 4️⃣ Update profile with avatar URL
        const { error: updateError } = await supabase.from('profiles')
          .update({ avatar_url })
          .eq('user_id', user.id);
        if (updateError) throw updateError;
      }

      // ✅ Done, navigate to login
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Register</h1>

      {/* Core fields */}
      <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} className="border p-2 mb-2 w-64" required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 mb-2 w-64" required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 mb-2 w-64" required />
      <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} className="border p-2 mb-2 w-64" />

      {/* Role */}
      <select name="role" value={form.role} onChange={handleChange} className="mb-2 border p-2 w-64">
        <option value="client">Client</option>
        <option value="freelancer">Freelancer</option>
      </select>

      {/* Profile info */}
      <input name="headline" placeholder="Headline" value={form.headline} onChange={handleChange} className="border p-2 mb-2 w-64" />
      <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} className="border p-2 mb-2 w-64" />

      {/* Avatar selection */}
      <AvatarUploader setAvatarUrl={handleAvatarSelect} />

      {/* Freelancer fields */}
      {form.role === "freelancer" && (
        <>
          <div className="w-64 mb-4 border p-2 rounded">
            <h3 className="font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.map(skill => (
                <button key={skill} type="button" onClick={() => handleSkillChange(skill)}
                  className={`p-1 text-xs rounded border ${
                    form.selected_skills.includes(skill)
                      ? 'bg-blue-500 text-white border-blue-700'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}>
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <EducationInput education={form.education} setEducation={edu => setForm(f => ({ ...f, education: edu }))} />
        </>
      )}

      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 w-64 rounded">
        {loading ? "Registering..." : "Register"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
