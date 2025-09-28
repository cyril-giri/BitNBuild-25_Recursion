import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

// Import Child Components
import ProfileSidebar from '../components/Profile/ProfileSidebar';
import ProfileOverview from '../components/Profile/ProfileOverview';
import LoggedInNavbar from '../components/LoggedInNavbar';
import Tabs from '../components/Dashboard/Shared/Tabs'; // Assuming this path is correct

// Import the new tab components
import WorkHistory from '../components/Profile/WorkHistory';
import ClientHistory from '../components/Profile/ClientHistory';
import ReviewList from '../components/Profile/ReviewList';
import { useApi } from '../lib/useApi';
import ProfileSettings from '../components/Profile/ProfileSettings';



export default function Profile() {
  // 1. Get ID from URL, but rename it to avoid conflicts
  const { id: paramId } = useParams(); 
  const { profile: currentUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');

  // 2. Determine which ID to use: the one from the URL, or the current user's ID as a fallback
  const profileIdToFetch = paramId || currentUserProfile?.id;

  // 3. Fetch profile data using the determined ID
  const { data: profile, loading, error } = useApi({
    fetchFn: () => {
      // Guard against running a query with no ID
      if (!profileIdToFetch) {
        return { data: null, error: { message: "Profile ID not found." } };
      }
      return supabase.from('profiles').select('*').eq('id', profileIdToFetch).single();
    },
    // The hook now depends on the final ID we want to fetch
    deps: [profileIdToFetch] 
  });

  if (loading) return <div className="text-center text-white mt-20">Loading Profile...</div>;
  if (error || !profile) return <div className="text-center text-red-500 mt-20">Profile not found.</div>;

  const isOwner = currentUserProfile?.id === profile.id;

  const getTabs = () => {
    const tabs = ['Overview', 'Reviews'];
    if (profile.role === 'freelancer') {
      tabs.splice(1, 0, 'Work History');
    } else if (profile.role === 'client') {
      tabs.splice(1, 0, 'Client History');
    }
    if (isOwner) {
      tabs.push('Settings');
    }
    return tabs;
  };

  return (
    <div className="bg-neutral-950 min-h-screen">
      <LoggedInNavbar />
      <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1">
          <ProfileSidebar profile={profile} isOwner={isOwner} />
        </div>

        <div className="lg:col-span-3">
          <Tabs tabs={getTabs()} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-6">
            {activeTab === 'Overview' && <ProfileOverview profile={profile} />}
            {activeTab === 'Work History' && <WorkHistory profileId={profile.id} />}
            {activeTab === 'Client History' && <ClientHistory profileId={profile.id} />}
            {activeTab === 'Reviews' && <ReviewList profileId={profile.id} />}
            {activeTab === 'Settings' && isOwner && <ProfileSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}