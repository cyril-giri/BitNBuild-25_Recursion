import React from 'react';

export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex border-b border-neutral-800">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-2 px-4 text-sm font-semibold transition-colors ${
            activeTab === tab 
              ? 'text-white border-b-2 border-cyan-500'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}