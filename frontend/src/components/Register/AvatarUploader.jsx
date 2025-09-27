import React from "react";

export default function AvatarUploader({ setAvatarUrl }) {
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) setAvatarUrl(file);
  };

  return (
    <div className="w-64 mb-4">
      <label htmlFor="avatar-upload" className="block text-sm font-medium mb-1">Profile Picture</label>
      <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} className="border p-2 w-full text-sm" />
    </div>
  );
}
