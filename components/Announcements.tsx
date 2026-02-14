
import React, { useState, useEffect } from 'react';
import { User, Announcement } from '../types';

interface AnnouncementsProps {
  user: User;
}

const Announcements: React.FC<AnnouncementsProps> = ({ user }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    // Load from localStorage if available, otherwise use defaults
    const stored = localStorage.getItem('notera_announcements');
    if (stored) return JSON.parse(stored);
    
    return [
      {
        id: 'a1',
        title: 'End sem result declared',
        content: 'The end-semester examination results have been finalized. Detailed scorecards and performance reports have been successfully dispatched to the registered university email addresses of all students. Please verify your inbox and contact the registrar\'s office for any discrepancies.',
        authorName: 'Admin',
        createdAt: '2 days ago'
      },
      {
        id: 'a2',
        title: 'Class Rescheduled',
        content: 'Quantum Physics lab rescheduled to friday 3 pm',
        authorName: 'Dr. Sunil Jadhav',
        createdAt: '5 hours ago'
      }
    ];
  });

  const [showModal, setShowModal] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: '', content: '' });

  // Update local storage whenever announcements change
  useEffect(() => {
    localStorage.setItem('notera_announcements', JSON.stringify(announcements));
  }, [announcements]);

  // Handle cross-tab/component updates
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('notera_announcements');
      if (stored) setAnnouncements(JSON.parse(stored));
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 3000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const ann: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      title: newAnn.title,
      content: newAnn.content,
      authorName: user.name,
      createdAt: 'Just now'
    };
    setAnnouncements([ann, ...announcements]);
    setNewAnn({ title: '', content: '' });
    setShowModal(false);
  };

  const deleteAnnouncement = (id: string) => {
    if (confirm("Are you sure you want to remove this announcement?")) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }
  };

  const canPost = user.role === 'teacher' || user.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-brand-primary dark:text-white tracking-tight">University Announcements</h2>
          <p className="text-brand-tertiary font-medium italic">Official updates from professors and administration.</p>
        </div>
        {canPost && (
          <button onClick={() => setShowModal(true)} className="px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-2xl font-black shadow-xl transition-all flex items-center gap-2 active:scale-95">
            <i className="fa-solid fa-bullhorn"></i> New Announcement
          </button>
        )}
      </div>

      <div className="space-y-6">
        {announcements.map((ann) => (
          <div key={ann.id} className={`bg-white dark:bg-dark-card rounded-[2.5rem] border border-brand-tertiary/10 dark:border-dark-border p-8 shadow-sm transition-all hover:border-brand-secondary relative group`}>
            {canPost && (
              <button 
                onClick={() => deleteAnnouncement(ann.id)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
              >
                <i className="fa-solid fa-trash-can text-xs"></i>
              </button>
            )}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-full bg-brand-surface dark:bg-brand-primary/20 flex items-center justify-center text-xs font-black text-brand-primary">
                {ann.authorName[0]}
              </span>
              <span className="text-[10px] font-black text-brand-tertiary uppercase tracking-widest">
                {ann.authorName} • {ann.createdAt}
                {ann.title.includes('CLASS TEST') && <span className="ml-2 text-emerald-500 font-black tracking-tighter">[TEST PUBLISHED]</span>}
              </span>
            </div>
            <h3 className="text-xl font-black text-brand-primary dark:text-white mb-3 tracking-tight">{ann.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{ann.content}</p>
            {ann.title.includes('CLASS TEST') && (
              <div className="mt-6 pt-6 border-t border-brand-tertiary/10">
                <button className="px-6 py-2 bg-brand-primary text-white rounded-xl font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all">
                  Take Assessment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-brand-tertiary/10 flex items-center justify-between">
              <h3 className="text-xl font-black text-brand-primary dark:text-white">Post Official Update</h3>
              <button onClick={() => setShowModal(false)} className="text-brand-tertiary hover:text-rose-500 transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <form onSubmit={handlePost} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Subject Header</label>
                <input type="text" value={newAnn.title} onChange={(e) => setNewAnn({...newAnn, title: e.target.value})} className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/10 rounded-2xl font-bold text-brand-primary dark:text-white outline-none focus:border-brand-secondary transition-all shadow-sm" placeholder="Title..." required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Details</label>
                <textarea value={newAnn.content} onChange={(e) => setNewAnn({...newAnn, content: e.target.value})} className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/10 rounded-2xl font-bold min-h-[120px] text-brand-primary dark:text-white outline-none focus:border-brand-secondary transition-all shadow-sm" placeholder="Type announcement here..." required />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-black text-brand-tertiary rounded-2xl hover:bg-brand-surface transition-all">Cancel</button>
                <button type="submit" className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl font-black shadow-xl transition-all active:scale-95">Post Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
