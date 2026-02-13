
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Forum from './components/Forum';
import NotesSection from './components/NotesSection';
import AILab from './components/AILab';
import Library from './components/Library';
import Auth from './components/Auth';
import { User } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'forum':
        return <Forum university={user.university} />;
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md px-8 py-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800 capitalize">
              {activeTab === 'ailab' ? 'Quiz AI' : activeTab}
            </h1>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
              <i className="fa-solid fa-building-columns text-indigo-500"></i>
              {user.university}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <i className="fa-solid fa-bell"></i>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500 font-medium capitalize">{user.role} • {user.classOrDept}</p>
              </div>
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-indigo-100 object-cover"
              />
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="p-8 pb-12">
          {renderContent()}
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95 z-50"
        title="Quick Quiz AI"
        onClick={() => setActiveTab('ailab')}
      >
        <i className="fa-solid fa-brain"></i>
      </button>
    </div>
  );
};

export default App;
