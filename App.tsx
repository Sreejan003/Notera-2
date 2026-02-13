
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
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('notera-theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('notera-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('notera-theme', 'light');
    }
  }, [darkMode]);

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
        return <Dashboard isDarkMode={darkMode} />;
      case 'forum':
        return <Forum university={user.university} />;
      case 'notes':
        return <NotesSection />;
      case 'ailab':
        return <AILab />;
      case 'library':
        return <Library />;
      default:
        return <Dashboard isDarkMode={darkMode} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg overflow-hidden theme-transition">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 dark:bg-dark-card/80 backdrop-blur-md px-8 py-4 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-slate-800 dark:text-white capitalize tracking-tight">
              {activeTab === 'ailab' ? 'AI Quiz Lab' : activeTab}
            </h1>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-transparent dark:border-slate-700">
              <i className="fa-solid fa-building-columns text-indigo-500"></i>
              {user.university}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <i className="fa-solid fa-bell"></i>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 dark:text-white">{user.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{user.role} • {user.classOrDept}</p>
              </div>
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-indigo-100 dark:border-indigo-900 object-cover"
              />
            </div>
          </div>
        </header>

        <div className="p-8 pb-12">
          {renderContent()}
        </div>
      </main>

      <button 
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl shadow-indigo-500/30 flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95 z-50 group"
        title="Quick AI Help"
        onClick={() => setActiveTab('ailab')}
      >
        <i className="fa-solid fa-wand-magic-sparkles group-hover:rotate-12 transition-transform"></i>
      </button>
    </div>
  );
};

export default App;
