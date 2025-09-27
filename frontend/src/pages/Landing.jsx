// src/pages/landing.jsx
import React from "react";
import Navbar from "../landing/navbar"; // adjust path if needed

export default function Landing() {
  return (
    <>
      <Navbar />
      <main className="p-6">
        <h2 className="text-2xl font-bold">Welcome to GigCampus</h2>
        <p className="mt-2 text-muted-foreground">
          This is your landing page content.
        </p>
      </main>
    </>
  );
}
