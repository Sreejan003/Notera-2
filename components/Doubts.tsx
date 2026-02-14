
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { MOCK_POSTS } from '../constants';
import { Post, User } from '../types';
import { checkContentSafety } from '../services/geminiService';

interface DoubtsProps {
  user: User;
}

const Doubts: React.FC<DoubtsProps> = ({ user }) => {
  const [doubts, setDoubts] = useState<Post[]>(() => {
    const stored = localStorage.getItem('notera_doubts');
    if (stored) return JSON.parse(stored);
    return MOCK_POSTS.filter(p => p.tags.includes('Academic') || p.isResolved);
  });

  const [showDoubtModal, setShowDoubtModal] = useState(false);
  const [resolveModalData, setResolveModalData] = useState<{ id: string, title: string } | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [newDoubt, setNewDoubt] = useState({ title: '', content: '', subject: 'Computer Science' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem('notera_doubts', JSON.stringify(doubts));
  }, [doubts]);

  const handleDoubtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoubt.title || !newDoubt.content) return;
    setIsSubmitting(true);
    try {
      const safety = await checkContentSafety(`${newDoubt.title} ${newDoubt.content}`);
      if (!safety.safe) { alert(`Doubt Blocked: ${safety.reason}`); setIsSubmitting(false); return; }
      const doubt: Post = {
        id: Math.random().toString(36).substr(2, 9), authorId: user.id, authorName: user.name, authorRole: 'Student',
        title: newDoubt.title, content: newDoubt.content, subject: newDoubt.subject,
        upvotes: 0, comments: 0, tags: ['Academic'], createdAt: 'Just now', isResolved: false
      };
      setDoubts(prev => [doubt, ...prev]);
      setShowDoubtModal(false);
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-brand-primary dark:text-white tracking-tight">Academic Doubts</h2>
          <p className="text-brand-tertiary font-medium italic">Shared university doubts repository.</p>
        </div>
        {user.role === 'student' && (
          <button onClick={() => setShowDoubtModal(true)} className="px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-2xl font-black shadow-xl transition-all flex items-center gap-2 active:scale-95">
            <i className="fa-solid fa-question"></i> Raise Doubt
          </button>
        )}
      </div>

      <div className="space-y-6">
        {doubts.map((doubt) => (
          <div key={doubt.id} className={`bg-white dark:bg-dark-card rounded-[2.5rem] border ${doubt.isResolved ? 'border-emerald-200 dark:border-emerald-900 shadow-emerald-500/5' : 'border-brand-tertiary/10 dark:border-dark-border'} p-8 shadow-sm transition-all relative overflow-hidden`}>
            <div className="absolute top-0 right-0"><div className="bg-brand-primary text-white text-[9px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-tighter">{doubt.subject}</div></div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${doubt.isResolved ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-surface dark:bg-brand-primary/20 text-brand-primary dark:text-brand-tertiary'}`}>
                {doubt.isResolved ? 'Resolved' : 'Pending'}
              </span>
              <span className="text-[10px] font-bold text-brand-tertiary uppercase tracking-widest">{doubt.authorName} • {doubt.createdAt}</span>
            </div>
            <h3 className="text-xl font-black text-brand-primary dark:text-white mb-3 tracking-tight pr-20">{doubt.title}</h3>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-6 markdown-content"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{doubt.content}</ReactMarkdown></div>
            {doubt.resolution && (
              <div className="bg-brand-surface dark:bg-brand-primary/10 p-6 rounded-2xl border border-brand-tertiary/20 animate-in fade-in slide-in-from-top-2 duration-500">
                <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest flex items-center gap-2 mb-2"><i className="fa-solid fa-graduation-cap"></i> Professor's Resolution</p>
                <div className="text-brand-primary dark:text-brand-tertiary font-bold italic markdown-content"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{doubt.resolution}</ReactMarkdown></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showDoubtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-brand-tertiary/10 flex items-center justify-between"><h3 className="text-xl font-black text-brand-primary dark:text-white">Raise Academic Doubt</h3><button onClick={() => setShowDoubtModal(false)} className="text-brand-tertiary hover:text-rose-500"><i className="fa-solid fa-xmark text-xl"></i></button></div>
            <form onSubmit={handleDoubtSubmit} className="p-8 space-y-5">
              <div><label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Subject</label><select value={newDoubt.subject} onChange={(e) => setNewDoubt({...newDoubt, subject: e.target.value})} className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/10 rounded-2xl outline-none font-bold text-brand-primary dark:text-white shadow-sm">{['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Humanities', 'Engineering'].map(s => <option key={s}>{s}</option>)}</select></div>
              <div><label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Question Title</label><input type="text" value={newDoubt.title} onChange={(e) => setNewDoubt({...newDoubt, title: e.target.value})} className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/10 rounded-2xl font-bold text-brand-primary dark:text-white outline-none focus:border-brand-secondary transition-all shadow-sm" placeholder="e.g. Normalization problem..." required /></div>
              <div><label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Detailed Doubt</label><textarea value={newDoubt.content} onChange={(e) => setNewDoubt({...newDoubt, content: e.target.value})} className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/10 rounded-2xl font-bold min-h-[120px] text-brand-primary dark:text-white outline-none focus:border-brand-secondary transition-all shadow-sm" placeholder="Explain where you're stuck..." required /></div>
              <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowDoubtModal(false)} className="flex-1 py-4 font-black text-brand-tertiary rounded-2xl hover:bg-brand-surface transition-all">Cancel</button><button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl font-black shadow-xl disabled:opacity-50 transition-all active:scale-95">{isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Submit Question'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doubts;
