// src/context/AuthContext.jsx - Optimized

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  
  // Combine these into one comprehensive state
  const [sessionLoading, setSessionLoading] = useState(true); 
  const [profileLoaded, setProfileLoaded] = useState(false); 

  // Combined Loading State for the consumer hook
  const fullLoading = sessionLoading || (user && !profileLoaded); 

  const fetchProfile = async (userId) => {
    setProfileLoaded(false); 
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
        console.warn("fetchProfile error:", error);
      }
      
      if (profileData) {
        setProfile(profileData);
        setRole(profileData.role);
      } else {
        // Handle case where user exists but profile isn't created yet (e.g., just signed up)
        setProfile(null);
        setRole('unregistered'); 
      }
    } catch (err) {
      console.error("fetchProfile exception:", err);
      setRole(null);
    } finally {
      setProfileLoaded(true);
    }
  };

  useEffect(() => {
    // 1. Initialize loading state
    setSessionLoading(true);

    // 2. Rely ONLY on the listener for initial state check
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      
      // We set session loading to false here, as the initial auth state is known.
      setSessionLoading(false); 

      if (session?.user) {
        setUser(session.user);
        // The only place fetchProfile is called for initial state or sign-in/out event
        fetchProfile(session.user.id); 
      } else {
        // Clear all states on sign out
        setUser(null);
        setProfile(null);
        setRole(null);
        setProfileLoaded(true); 
      }
    });

    // 3. Cleanup the listener
    return () => listener.subscription.unsubscribe();
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <AuthContext.Provider value={{ user, role, profile, loading: fullLoading, setUser, setRole, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);