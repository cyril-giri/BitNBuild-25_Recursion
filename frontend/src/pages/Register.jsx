// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import EducationInput from "../components/Register/EducationInput";
import AvatarUploader from "../components/Register/AvatarUploader";
import {
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  FileText,
  GraduationCap,
} from "lucide-react";

const ALL_SKILLS = [
  "Frontend",
  "Backend",
  "Fullstack",
  "Design",
  "Writing",
  "Mobile Dev",
  "Data Science",
  "Marketing",
  "SEO",
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
    avatarFile: null,
    avatar_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSkillChange = (skill) => {
    setForm((f) => ({
      ...f,
      selected_skills: f.selected_skills.includes(skill)
        ? f.selected_skills.filter((s) => s !== skill)
        : [...f.selected_skills, skill],
    }));
  };

  const handleAvatarSelect = (file) => {
    setForm((f) => ({ ...f, avatarFile: file }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const password =
        form.password || Math.random().toString(36).substring(2);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password,
        options: { data: { full_name: form.full_name } },
      });
      if (authError) throw authError;
      const user = authData.user;
      if (!user) throw new Error("User creation failed");

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          user_id: user.id,
          role: form.role,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          headline: form.headline,
          bio: form.bio,
          skills: form.role === "freelancer" ? form.selected_skills : [],
          education: form.education,
          avatar_url: "",
        },
      ]);
      if (profileError) throw profileError;

      if (form.avatarFile) {
        const fileExt = form.avatarFile.name.split(".").pop();
        const filePath = `avatars/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, form.avatarFile);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        const avatar_url = publicData.publicUrl;

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url })
          .eq("user_id", user.id);
        if (updateError) throw updateError;
      }

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8">
        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className="w-1/2 py-2 text-center rounded-l-lg bg-gray-700 text-gray-300"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
          <button className="w-1/2 py-2 text-center rounded-r-lg bg-teal-500 text-white">
            Sign Up
          </button>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Create your account
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Get started with your free account today
        </p>

        {/* Role Toggle */}
        <div className="flex mb-6 gap-2">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, role: "freelancer" }))}
            className={`flex-1 py-3 rounded-lg border ${
              form.role === "freelancer"
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-gray-900 text-gray-400 border-gray-600"
            }`}
          >
            <GraduationCap className="inline-block w-5 h-5 mr-2" />
            Student
          </button>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, role: "client" }))}
            className={`flex-1 py-3 rounded-lg border ${
              form.role === "client"
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-gray-900 text-gray-400 border-gray-600"
            }`}
          >
            <Briefcase className="inline-block w-5 h-5 mr-2" />
            Client
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full h-12 pl-10 pr-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              name="email"
              type="email"
              placeholder="University Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full h-12 pl-10 pr-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full h-12 pl-10 pr-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              name="phone"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={handleChange}
              className="w-full h-12 pl-10 pr-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Headline */}
          <input
            name="headline"
            placeholder="Headline"
            value={form.headline}
            onChange={handleChange}
            className="w-full h-12 pl-4 pr-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-teal-500"
          />

          {/* Bio */}
          <textarea
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full h-20 pl-4 pr-4 pt-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-teal-500"
          />

          {/* Avatar */}
          <AvatarUploader setAvatarUrl={handleAvatarSelect} />

          {/* Freelancer Skills + Education */}
          {form.role === "freelancer" && (
            <>
              <div className="w-full border border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-white">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillChange(skill)}
                      className={`px-3 py-1 text-xs rounded-lg transition ${
                        form.selected_skills.includes(skill)
                          ? "bg-teal-500 text-white"
                          : "bg-gray-900 text-gray-300 border border-gray-600"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <EducationInput
                education={form.education}
                setEducation={(edu) =>
                  setForm((f) => ({ ...f, education: edu }))
                }
              />
            </>
          )}

          {/* Terms */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <input type="checkbox" required className="accent-teal-500" />
            <span>
              I agree to the{" "}
              <span className="text-teal-400 cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-teal-400 cursor-pointer">Privacy Policy</span>
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
