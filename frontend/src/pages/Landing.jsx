import React from "react";
import HeroSection from "../components/Landing/HeroSection";
import Navbar from "../components/Landing/navbar";
import WhoAmI from "../components/Landing/WhoAmI";
import FeatureGrid from "../components/Landing/FeatureGrid";
import ProductPreviews from "../components/Landing/ProductPreviews";
import HowItWorks from "../components/Landing/HowItWorks";

function Landing() {
  return (
    <div className="theme-gigcampus bg-black min-h-screen text-white">
        <Navbar />
      <HeroSection />
      <WhoAmI />
        <FeatureGrid />
        <ProductPreviews />
        <HowItWorks/>
    </div>
  );
}

export default Landing;
