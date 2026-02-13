
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'forum', icon: 'fa-comments', label: 'Community Forum' },
    { id: 'notes', icon: 'fa-file-lines', label: 'Note Repository' },
    { id: 'ailab', icon: 'fa-brain', label: 'Quiz AI' },
    { id: 'library', icon: 'fa-book', label: 'Library & Refs' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
            N
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">Notera</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg ${activeTab === item.id ? 'text-indigo-600' : ''}`}></i>
            <span className="font-semibold">{item.label}</span>
            {activeTab === item.id && (
              <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-semibold"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
