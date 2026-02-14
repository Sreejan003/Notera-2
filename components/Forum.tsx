
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { MOCK_POSTS } from '../constants';
import { checkContentSafety } from '../services/geminiService';
import { Post, User, Comment } from '../types';

interface ForumProps {
  user: User;
}

const Forum: React.FC<ForumProps> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('notera_forum_posts');
    return saved ? JSON.parse(saved) : MOCK_POSTS.filter(p => !p.isResolved);
  });

  const [userVotes, setUserVotes] = useState<{ [key: string]: 'up' | 'down' | null }>(() => {
    const savedVotes = localStorage.getItem(`notera_votes_${user.id}`);
    return savedVotes ? JSON.parse(savedVotes) : {};
  });

  const [showPostModal, setShowPostModal] = useState(false);
  const [activePostForComments, setActivePostForComments] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '', subject: 'General', imageUrl: '' });
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('notera_forum_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(`notera_votes_${user.id}`, JSON.stringify(userVotes));
  }, [userVotes, user.id]);

  const handleVote = (postId: string, direction: 'up' | 'down') => {
    const currentVote = userVotes[postId] || null;
    let scoreDelta = 0;
    let nextVote: 'up' | 'down' | null = null;

    if (direction === 'up') {
      if (currentVote === 'up') { scoreDelta = -1; nextVote = null; }
      else if (currentVote === 'down') { scoreDelta = 2; nextVote = 'up'; }
      else { scoreDelta = 1; nextVote = 'up'; }
    } else {
      if (currentVote === 'down') { scoreDelta = 1; nextVote = null; }
      else if (currentVote === 'up') { scoreDelta = -2; nextVote = 'down'; }
      else { scoreDelta = -1; nextVote = 'down'; }
    }

    setPosts(prev => prev.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + scoreDelta } : p));
    setUserVotes(prev => ({ ...prev, [postId]: nextVote }));
  };

  const handlePostSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    setIsSubmitting(true);
    try {
      const safety = await checkContentSafety(`${newPost.title} ${newPost.content}`);
      if (!safety.safe) { alert(`Blocked: ${safety.reason}`); setIsSubmitting(false); return; }
      const post: Post = {
        id: Math.random().toString(36).substr(2, 9),
        authorId: user.id, authorName: user.name,
        authorRole: user.role === 'teacher' ? 'Professor' : 'Student',
        title: newPost.title, content: newPost.content, subject: newPost.subject,
        upvotes: 0, comments: 0, commentsList: [],
        tags: newPost.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        createdAt: 'Just now', imageUrl: newPost.imageUrl || undefined, isResolved: false
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '', tags: '', subject: 'General', imageUrl: '' });
      setShowPostModal(false);
    } catch (err) { alert("Communication error."); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-brand-primary dark:text-white tracking-tight">Student Community</h2>
          <p className="text-brand-tertiary font-medium italic">Shared university discussions.</p>
        </div>
        <button onClick={() => setShowPostModal(true)} className="px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-2xl font-black shadow-xl transition-all flex items-center gap-2 active:scale-95">
          <i className="fa-solid fa-plus"></i> New Post
        </button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-dark-card rounded-[2rem] border border-brand-tertiary/10 dark:border-dark-border p-8 shadow-sm transition-all hover:border-brand-secondary">
            <div className="flex gap-8">
              <div className="flex flex-col items-center gap-1">
                <button onClick={() => handleVote(post.id, 'up')} className={`p-2 transition-all ${userVotes[post.id] === 'up' ? 'text-brand-secondary scale-110' : 'text-slate-300 dark:text-slate-700 hover:text-brand-tertiary'}`}><i className="fa-solid fa-circle-chevron-up text-2xl"></i></button>
                <span className={`font-black text-sm ${userVotes[post.id] === 'up' ? 'text-brand-secondary' : userVotes[post.id] === 'down' ? 'text-brand-primary' : 'text-slate-800 dark:text-slate-300'}`}>{post.upvotes}</span>
                <button onClick={() => handleVote(post.id, 'down')} className={`p-2 transition-all ${userVotes[post.id] === 'down' ? 'text-brand-primary scale-110' : 'text-slate-300 dark:text-slate-700 hover:text-brand-tertiary'}`}><i className="fa-solid fa-circle-chevron-down text-2xl"></i></button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold text-brand-tertiary uppercase tracking-widest">{post.authorName} • {post.subject} • {post.createdAt}</span>
                </div>
                <h3 className="text-xl font-black text-brand-primary dark:text-white mb-3 tracking-tight">{post.title}</h3>
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-4 markdown-content"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{post.content}</ReactMarkdown></div>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-brand-tertiary/10">
                  <button onClick={() => setActivePostForComments(post)} className="flex items-center gap-2 text-xs font-black text-brand-tertiary hover:text-brand-secondary transition-colors"><i className="fa-regular fa-message"></i> {post.comments} Comments</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-8 border-b border-brand-tertiary/10 flex items-center justify-between"><h3 className="text-xl font-black text-brand-primary dark:text-white">Start a Discussion</h3><button onClick={() => setShowPostModal(false)} className="text-brand-tertiary hover:text-rose-500"><i className="fa-solid fa-xmark text-xl"></i></button></div>
             <form onSubmit={handlePostSubmit} className="p-8 space-y-5">
                <div><label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Category</label><select value={newPost.subject} onChange={(e) => setNewPost({...newPost, subject: e.target.value})} className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/10 rounded-2xl outline-none font-bold text-brand-primary dark:text-white">{['General', 'Social', 'Hobbies', 'Events', 'Clubs'].map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Post Title</label><input type="text" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/10 rounded-2xl font-bold text-brand-primary dark:text-white outline-none focus:border-brand-secondary transition-all" placeholder="Topic name..." required /></div>
                <div><label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Description</label><textarea value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/10 rounded-2xl font-bold min-h-[120px] text-brand-primary dark:text-white outline-none focus:border-brand-secondary transition-all" placeholder="Share your thoughts..." required /></div>
                <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowPostModal(false)} className="flex-1 py-4 font-black text-brand-tertiary rounded-2xl hover:bg-brand-surface transition-all">Cancel</button><button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl font-black shadow-xl disabled:opacity-50 transition-all hover:bg-brand-secondary active:scale-95">{isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Publish Post'}</button></div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
