import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

const LoggedInNavbar = () => {
  const { user, setUser, setRole, setProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    // Only log unexpected errors
    if (error && error.message !== "Auth session missing!") {
      console.error('Logout error:', error.message);
      return;
    }

    // Clear context
    setUser(null);
    setRole(null);
    setProfile(null);

    // Redirect to login or landing page
    navigate('/');
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleContracts = () => {
    navigate("/contracts");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleProjects = () => {
    navigate("/projects");
  };

  const handleMessages = () => {
    navigate("/messages");
  };

  return (
    <nav className="w-full bg-black border-b border-neutral-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl text-cyan-400">GigCampus</span>
      </div>
      <div className="flex-1 flex justify-center gap-8">
        <button
          onClick={handleDashboard}
          className="text-white font-semibold text-lg hover:text-cyan-400 transition-colors"
        >
          Dashboard
        </button>
        <button
          onClick={handleProjects}
          className="text-white font-semibold text-lg hover:text-cyan-400 transition-colors"
        >
          Projects
        </button>
        <button
          onClick={handleContracts}
          className="text-white font-semibold text-lg hover:text-cyan-400 transition-colors"
        >
          Contracts
        </button>
        <button
          onClick={handleMessages}
          className="text-white font-semibold text-lg hover:text-cyan-400 transition-colors"
        >
          Messages
        </button>
        <button
          onClick={handleProfile}
          className="text-white font-semibold text-lg hover:text-cyan-400 transition-colors"
        >
          Profile
        </button>
      </div>
      <div>
        {user ? (
          <Button onClick={handleLogout} className="ml-4 bg-white text-black" variant="secondary">
            Logout
          </Button>
        ) : (
          <Button onClick={handleLogin} className="ml-4">
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default LoggedInNavbar;