
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Forum from './components/Forum';
import NotesSection from './components/NotesSection';
import AILab from './components/AILab';
import Library from './components/Library';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [university, setUniversity] = useState('Stanford University');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'forum':
        return <Forum university={university} />;
      case 'notes':
        return <NotesSection />;
      case 'ailab':
        return <AILab />;
      case 'library':
        return <Library />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Fixed */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md px-8 py-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h1>
            <div className="h-6 w-px bg-slate-200"></div>
            <select 
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option>Stanford University</option>
              <option>MIT</option>
              <option>Harvard University</option>
              <option>UC Berkeley</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <i className="fa-solid fa-bell"></i>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">Alex Rivers</p>
                <p className="text-xs text-slate-500 font-medium">Student • CS Major</p>
              </div>
              <img 
                src="https://picsum.photos/seed/user1/100/100" 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-indigo-100"
              />
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="p-8 pb-12">
          {renderContent()}
        </div>
      </main>

      {/* Floating Action Button (Optional Context-specific) */}
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95 z-50"
        title="Quick AI Help"
        onClick={() => setActiveTab('ailab')}
      >
        <i className="fa-solid fa-brain"></i>
      </button>
    </div>
  );
};

export default App;
