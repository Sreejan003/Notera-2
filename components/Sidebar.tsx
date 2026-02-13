
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, darkMode, toggleDarkMode }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'forum', icon: 'fa-comments', label: 'Community' },
    { id: 'notes', icon: 'fa-file-lines', label: 'Notes Share' },
    { id: 'ailab', icon: 'fa-microchip', label: 'AI Quiz' },
    { id: 'library', icon: 'fa-book-bookmark', label: 'Ref Library' },
  ];

  return (
    <aside className="w-72 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-colors">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20">
            N
          </div>
          <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">Notera</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
              activeTab === item.id
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg ${activeTab === item.id ? 'text-indigo-600' : ''}`}></i>
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
            {activeTab === item.id && (
              <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 space-y-4">
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-3">
            <i className={`fa-solid ${darkMode ? 'fa-moon' : 'fa-sun'} text-lg`}></i>
            <span className="font-bold text-sm">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div className={`w-10 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}>
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
