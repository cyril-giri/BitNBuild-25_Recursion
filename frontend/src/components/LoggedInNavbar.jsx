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
    navigate('/'); // or '/login' for LogoutButton
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="w-full bg-black border-b border-neutral-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl text-cyan-400">GigCampus</span>
      </div>
      <div>
        {user ? (
          <Button onClick={handleLogout} className="ml-4 bg-white" variant="secondary">
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