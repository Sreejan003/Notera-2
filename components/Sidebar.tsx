
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'forum', icon: 'fa-comments', label: 'Community Forum' },
    { id: 'notes', icon: 'fa-file-lines', label: 'Note Repository' },
    { id: 'ailab', icon: 'fa-robot', label: 'AI Study Lab' },
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
        <div className="p-6 bg-slate-900 rounded-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="text-white font-bold mb-1">Upgrade to Pro</h4>
            <p className="text-slate-400 text-xs mb-4">Unlimited AI Quiz generation and 50GB storage.</p>
            <button className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold transition-colors">
              Go Premium
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-600/20 rounded-full blur-2xl group-hover:bg-indigo-600/40 transition-all"></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
