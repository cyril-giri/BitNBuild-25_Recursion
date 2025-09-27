import React from "react";
import { Button } from "@/components/ui/button";
import Navbar from "./components/Landing/navbar"; // ✅ fixed path

function App() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Navbar stays at the top */}
      <Navbar />

      {/* Page content */}
      <div className="flex flex-1 items-center justify-center">
        <Button className="bg-blue-500 text-white">Click me</Button>
      </div>
    </div>
  );
}

export default App;
