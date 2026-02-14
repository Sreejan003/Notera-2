
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Forum from './components/Forum';
import Doubts from './components/Doubts';
import Announcements from './components/Announcements';
import NotesSection from './components/NotesSection';
import AILab from './components/AILab';
import Library from './components/Library';
import Auth from './components/Auth';
import { User } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('notera-theme') === 'dark');

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
    setActiveTab('dashboard');
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          user={user} 
          isDarkMode={darkMode} 
          onTabChange={setActiveTab}
        />;
      case 'forum':
        return <Forum user={user} />;
      case 'doubts':
        return <Doubts user={user} />;
      case 'announcements':
        return <Announcements user={user} />;
      case 'notes':
        return <NotesSection user={user} />;
      case 'ailab':
        return <AILab user={user} />;
      case 'library':
        return <Library />;
      default:
        return <Dashboard user={user} isDarkMode={darkMode} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-surface dark:bg-dark-bg overflow-hidden theme-transition font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        user={user}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 dark:bg-dark-card/80 backdrop-blur-md px-8 py-4 border-b border-brand-tertiary/20 dark:border-brand-primary/30 transition-colors">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-brand-primary dark:text-white capitalize tracking-tight">
              {activeTab === 'ailab' ? 'AI Quiz' : activeTab}
            </h1>
            <div className="h-6 w-px bg-brand-tertiary/30 dark:bg-brand-primary/50"></div>
            
            <div className="hidden lg:flex bg-brand-surface dark:bg-brand-primary/20 text-brand-primary dark:text-brand-tertiary px-4 py-1.5 rounded-full text-sm font-bold items-center gap-2 border border-brand-tertiary/10 dark:border-brand-primary/40">
              <i className="fa-solid fa-building-columns text-brand-secondary"></i>
              {user.university}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-brand-tertiary/30 dark:border-brand-primary/40">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-brand-primary dark:text-white">{user.name}</p>
                <p className="text-[10px] text-brand-secondary dark:text-brand-tertiary font-bold uppercase tracking-widest">{user.role} • {user.classOrDept || user.department}</p>
              </div>
              <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-brand-tertiary dark:border-brand-primary object-cover" alt="User" />
            </div>
          </div>
        </header>

        <div className="p-8 pb-12">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
