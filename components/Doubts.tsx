
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { MOCK_POSTS } from '../constants';
import { Post, User } from '../types';
import { checkContentSafety, solveDoubt } from '../services/geminiService';

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
  const [resolveModalData, setResolveModalData] = useState<{ id: string, title: string, content: string } | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
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
      if (!safety.safe) { 
        alert(`Doubt Blocked: ${safety.reason}`); 
        setIsSubmitting(false); 
        return; 
      }
      const doubt: Post = {
        id: Math.random().toString(36).substr(2, 9), 
        authorId: user.id, 
        authorName: user.name, 
        authorRole: 'Student',
        title: newDoubt.title, 
        content: newDoubt.content, 
        subject: newDoubt.subject,
        upvotes: 0, 
        comments: 0, 
        tags: ['Academic'], 
        createdAt: 'Just now', 
        isResolved: false
      };
      setDoubts(prev => [doubt, ...prev]);
      setShowDoubtModal(false);
      setNewDoubt({ title: '', content: '', subject: 'Computer Science' });
    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleAiDraft = async () => {
    if (!resolveModalData) return;
    setIsDrafting(true);
    try {
      const draft = await solveDoubt(resolveModalData.title, resolveModalData.content);
      setResolutionText(draft || '');
    } catch (err) {
      alert("Failed to generate draft. Please check your API key.");
    } finally {
      setIsDrafting(false);
    }
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionText.trim() || !resolveModalData) return;
    
    setIsResolving(true);
    
    setTimeout(() => {
      const updatedDoubts = doubts.map(d => {
        if (d.id === resolveModalData.id) {
          return {
            ...d,
            isResolved: true,
            resolution: resolutionText,
            resolvedAt: 'Just now'
          };
        }
        return d;
      });
      
      setDoubts(updatedDoubts);
      setResolveModalData(null);
      setResolutionText('');
      setIsResolving(false);
    }, 800);
  };

  const isTeacher = user.role === 'teacher';

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
          <div key={doubt.id} className={`bg-white dark:bg-dark-card rounded-[2.5rem] border ${doubt.isResolved ? 'border-emerald-200 dark:border-emerald-900 shadow-sm shadow-emerald-500/5' : 'border-brand-tertiary/10 dark:border-dark-border'} p-8 shadow-sm transition-all relative overflow-hidden`}>
            <div className="absolute top-0 right-0"><div className="bg-brand-primary text-white text-[9px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-tighter">{doubt.subject}</div></div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${doubt.isResolved ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-brand-surface dark:bg-brand-primary/20 text-brand-primary dark:text-brand-tertiary'}`}>
                {doubt.isResolved ? 'Resolved' : 'Pending'}
              </span>
              <span className="text-[10px] font-bold text-brand-tertiary uppercase tracking-widest">{doubt.authorName} • {doubt.createdAt}</span>
            </div>
            <h3 className="text-xl font-black text-brand-primary dark:text-white mb-3 tracking-tight pr-20">{doubt.title}</h3>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-6 markdown-content">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{doubt.content}</ReactMarkdown>
            </div>
            
            {doubt.resolution ? (
              <div className="bg-brand-surface dark:bg-brand-primary/10 p-6 rounded-3xl border border-brand-tertiary/20 animate-in fade-in slide-in-from-top-2 duration-500">
                <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest flex items-center gap-2 mb-3">
                  <i className="fa-solid fa-graduation-cap text-brand-primary"></i> Professor's Resolution
                </p>
                <div className="text-brand-primary dark:text-brand-tertiary font-bold italic markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{doubt.resolution}</ReactMarkdown>
                </div>
              </div>
            ) : (
              isTeacher && (
                <div className="mt-4 pt-6 border-t border-brand-tertiary/10">
                  <button 
                    onClick={() => setResolveModalData({ id: doubt.id, title: doubt.title, content: doubt.content })}
                    className="px-6 py-3 bg-brand-secondary hover:bg-brand-primary text-white rounded-xl font-black text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-pen-to-square"></i> Provide Resolution
                  </button>
                </div>
              )
            )}
          </div>
        ))}

        {doubts.length === 0 && (
          <div className="py-20 text-center">
            <i className="fa-solid fa-message-slash text-6xl text-brand-tertiary/20 mb-4"></i>
            <p className="text-brand-tertiary font-bold italic">The repository is currently empty.</p>
          </div>
        )}
      </div>

      {showDoubtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-brand-tertiary/10 flex items-center justify-between">
              <h3 className="text-xl font-black text-brand-primary dark:text-white">Raise Academic Doubt</h3>
              <button onClick={() => setShowDoubtModal(false)} className="text-brand-tertiary hover:text-rose-500"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <form onSubmit={handleDoubtSubmit} className="p-8 space-y-5">
              <div><label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Subject</label><select value={newDoubt.subject} onChange={(e) => setNewDoubt({...newDoubt, subject: e.target.value})} className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/10 rounded-2xl outline-none font-bold text-brand-primary dark:text-white shadow-sm">{['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Humanities', 'Engineering'].map(s => <option key={s}>{s}</option>)}</select></div>
              <div><label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Question Title</label><input type="text" value={newDoubt.title} onChange={(e) => setNewDoubt({...newDoubt, title: e.target.value})} className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/10 rounded-2xl font-bold text-brand-primary dark:text-white outline-none focus:border-brand-secondary transition-all shadow-sm" placeholder="e.g. Normalization problem..." required /></div>
              <div><label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Detailed Doubt</label><textarea value={newDoubt.content} onChange={(e) => setNewDoubt({...newDoubt, content: e.target.value})} className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/10 rounded-2xl font-bold min-h-[120px] text-brand-primary dark:text-white outline-none focus:border-brand-secondary transition-all shadow-sm" placeholder="Explain where you're stuck..." required /></div>
              <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowDoubtModal(false)} className="flex-1 py-4 font-black text-brand-tertiary rounded-2xl hover:bg-brand-surface transition-all">Cancel</button><button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl font-black shadow-xl disabled:opacity-50 transition-all active:scale-95">{isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Submit Question'}</button></div>
            </form>
          </div>
        </div>
      )}

      {resolveModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/60 backdrop-blur-md">
          <div className="bg-white dark:bg-dark-card w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-brand-tertiary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-surface dark:bg-brand-primary/20 text-brand-primary rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <h3 className="text-xl font-black text-brand-primary dark:text-white">Resolve Doubt</h3>
              </div>
              <button onClick={() => setResolveModalData(null)} className="text-brand-tertiary hover:text-rose-500"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto bg-brand-surface/30 dark:bg-dark-bg/20">
              <p className="text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Student Query</p>
              <h4 className="text-lg font-black text-brand-primary dark:text-white mb-2">{resolveModalData.title}</h4>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 italic">
                {resolveModalData.content}
              </div>

              <form onSubmit={handleResolveSubmit} className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest">Professor's Explanation (LaTeX Supported)</label>
                    <button 
                      type="button" 
                      onClick={handleAiDraft}
                      disabled={isDrafting}
                      className="text-[10px] font-black text-brand-secondary hover:text-brand-primary flex items-center gap-1 uppercase tracking-widest transition-all"
                    >
                      {isDrafting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-sparkles"></i>} 
                      AI Draft Assistance
                    </button>
                  </div>
                  <textarea 
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    className="w-full px-6 py-4 bg-white dark:bg-dark-bg border-2 border-brand-tertiary/20 rounded-2xl font-bold min-h-[200px] text-brand-primary dark:text-white outline-none focus:border-brand-secondary transition-all shadow-sm"
                    placeholder="Provide a clear, authoritative explanation. Use $...$ for equations."
                    required
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setResolveModalData(null)} className="flex-1 py-4 font-black text-brand-tertiary rounded-2xl hover:bg-brand-surface transition-all">Dismiss</button>
                  <button 
                    type="submit" 
                    disabled={isResolving || !resolutionText.trim()} 
                    className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-xl disabled:opacity-50 transition-all active:scale-95"
                  >
                    {isResolving ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Submit Resolution'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doubts;
