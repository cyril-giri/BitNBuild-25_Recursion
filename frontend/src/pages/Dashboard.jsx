import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';
import ClientDashboard from '../components/Dashboard/Client/ClientDashboard';
import FreelancerDashboard from '../components/Dashboard/Freelancer/FreelancerDashboard';

export default function Dashboard() {
  const { profile, role, loading } = useAuth();

  if (loading) {
    return <div className="bg-neutral-950 min-h-screen text-center text-white pt-20">Loading Dashboard...</div>;
  }

  // Header component that can be shared or customized
  const DashboardHeader = () => (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">Welcome, {profile.full_name}</h1>
      <p className="text-neutral-400">Here's a summary of your activity.</p>
    </div>
  );

  return (
    <div className="bg-neutral-950 min-h-screen text-white">
      <LoggedInNavbar />
      <div className="max-w-6xl mx-auto py-10 px-4">
        <DashboardHeader />
        {role === 'client' && <ClientDashboard />}
        {role === 'freelancer' && <FreelancerDashboard />}
      </div>
    </div>
  );
}