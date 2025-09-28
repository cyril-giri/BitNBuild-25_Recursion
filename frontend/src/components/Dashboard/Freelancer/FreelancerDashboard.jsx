import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectListFreelancer from './ProjectListFreelancer';
import ContractListDashboard from '../Shared/ContractListDashboard';
import Tabs from '../Shared/Tabs';

export default function FreelancerDashboard() {
  const [activeTab, setActiveTab] = useState('Available Projects');
  const tabs = ['Available Projects', 'My Contracts'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <Link to="/projects" className="bg-cyan-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors">
          Browse All Projects
        </Link>
      </div>

      <div>
        {activeTab === 'Available Projects' && <ProjectListFreelancer />}
        {activeTab === 'My Contracts' && <ContractListDashboard />}
      </div>
    </div>
  );
}