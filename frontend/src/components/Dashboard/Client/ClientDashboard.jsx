import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectListClient from './ProjectListClient';
import ContractListDashboard from '../Shared/ContractListDashboard';
import Tabs from '../Shared/Tabs';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('My Projects');
  const tabs = ['My Projects', 'My Contracts'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <Link to="/projects/new" className="bg-cyan-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors">
          + Post New Project
        </Link>
      </div>
      
      <div>
        {activeTab === 'My Projects' && <ProjectListClient />}
        {activeTab === 'My Contracts' && <ContractListDashboard />}
      </div>
    </div>
  );
}