import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";

const initialState = {
  file: null,
  notes: "",
  milestone_id: "",
};

export default function SubmitDeliverableModal({ open, onClose, onSubmit, loading }) {
  const { profile } = useAuth();
  const [form, setForm] = useState(initialState);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  // Helper: Upload file to Supabase Storage and return public URL
  const uploadFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `deliverables/${profile.id}/${Date.now()}.${fileExt}`;
    let { error: uploadError } = await supabase.storage
      .from("deliverables")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage.from("deliverables").getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Helper: Generate a preview URL (simulate watermarking)
  const generatePreviewUrl = async (fileUrl) => {
    // In real app, you would call a backend function to watermark the file.
    // For now, just return the same fileUrl as a placeholder.
    return fileUrl;
  };

  // Helper: Compute SHA256 hash (optional, for proof)
  const computeHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((f) => ({ ...f, file: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      if (!form.file) throw new Error("Please select a file to upload.");

      // 1. Upload file to Supabase Storage
      const file_url = await uploadFile(form.file);

      // 2. Generate preview URL (watermarked)
      const preview_url = await generatePreviewUrl(file_url);

      // 3. Compute hash
      const hash = await computeHash(form.file);

      // 4. Call parent onSubmit with deliverable data
      await onSubmit({
        file_url,
        preview_url,
        notes: form.notes,
        hash,
        milestone_id: "", // No milestone selection
      });

      setForm(initialState);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit deliverable.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-950 border border-neutral-800 rounded-xl p-8 w-full max-w-md shadow-xl flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold text-white mb-2">Submit Deliverable</h2>
        <label className="text-neutral-300 text-sm font-medium">
          File
          <input
            type="file"
            name="file"
            accept="*"
            onChange={handleChange}
            className="block mt-1 text-neutral-200"
            required
            disabled={uploading || loading}
          />
        </label>
        <label className="text-neutral-300 text-sm font-medium">
          Notes (optional)
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-neutral-900 border border-neutral-800 text-white"
            rows={3}
            placeholder="Explain your work, add context, etc."
            disabled={uploading || loading}
          />
        </label>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={uploading || loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={uploading || loading}
          >
            {uploading || loading ? "Uploading..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}