import React from "react";
import HeroSection from "../components/Landing/HeroSection";
import Navbar from "../components/Landing/navbar";
import WhoAmI from "../components/Landing/WhoAmI";
function Landing() {
  return (
    <div className="theme-gigcampus bg-black min-h-screen text-white">
        <Navbar />
      <HeroSection />
      <WhoAmI />
    </div>
  );
}

export default Landing;
