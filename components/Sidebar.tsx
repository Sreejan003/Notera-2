
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, darkMode, toggleDarkMode, user }) => {
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
      { id: 'announcements', icon: 'fa-bullhorn', label: 'Announcements' },
      { id: 'doubts', icon: 'fa-question-circle', label: 'Doubts' },
      { id: 'notes', icon: 'fa-file-lines', label: 'Notes Share' },
    ];

    if (user.role === 'student') {
      return [
        ...baseItems,
        { id: 'forum', icon: 'fa-comments', label: 'Community' },
        { id: 'ailab', icon: 'fa-microchip', label: 'AI Quiz' },
        { id: 'library', icon: 'fa-book-bookmark', label: 'Ref Library' },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-72 bg-white dark:bg-dark-card border-r border-brand-tertiary/20 dark:border-dark-border flex flex-col shrink-0 transition-colors">
      <div className="p-8">
        <div className="flex items-center gap-4">
          {/* Brand-aligned Book Logo */}
          <div className="relative w-12 h-14 bg-brand-primary rounded-r-lg border-l-4 border-brand-secondary shadow-lg flex items-center justify-center overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10"></div>
            <span className="text-white text-3xl font-serif select-none transform -translate-y-0.5">N</span>
          </div>
          <span className="text-2xl font-black text-brand-primary dark:text-white tracking-tighter">Notera</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
              activeTab === item.id
                ? 'bg-brand-surface dark:bg-brand-primary/20 text-brand-primary dark:text-brand-tertiary shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-brand-surface dark:hover:bg-brand-primary/10 hover:text-brand-primary dark:hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg ${activeTab === item.id ? 'text-brand-secondary' : ''}`}></i>
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
            {activeTab === item.id && (
              <div className="ml-auto w-1.5 h-1.5 bg-brand-secondary dark:bg-brand-tertiary rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 space-y-4">
        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-brand-surface dark:hover:bg-brand-primary/10 transition-all border border-brand-tertiary/10 dark:border-dark-border"
        >
          <div className="flex items-center gap-3">
            <i className={`fa-solid ${darkMode ? 'fa-moon' : 'fa-sun'} text-lg`}></i>
            <span className="font-bold text-sm">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div className={`w-10 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-brand-secondary' : 'bg-brand-tertiary/30'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-5' : 'left-1'}`}></div>
          </div>
        </button>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 transition-all font-bold text-sm"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
