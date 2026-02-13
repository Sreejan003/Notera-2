
import React, { useState, useRef } from 'react';
import { MOCK_POSTS, CENSORED_WORDS } from '../constants';
import { checkContentSafety } from '../services/geminiService';
import { Post } from '../types';

interface ForumProps {
  university: string;
}

const Forum: React.FC<ForumProps> = ({ university }) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '', imageUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.title || !newPost.content) return;
    setIsSubmitting(true);

    const safety = await checkContentSafety(`${newPost.title} ${newPost.content}`);
    
    if (!safety.safe) {
      alert(`Post blocked by Notera AI Moderator: ${safety.reason}`);
      setIsSubmitting(false);
      return;
    }

    const containsCensored = CENSORED_WORDS.some(word => 
      newPost.title.toLowerCase().includes(word) || newPost.content.toLowerCase().includes(word)
    );

    if (containsCensored) {
      alert('Post contains restricted language. Please revise.');
      setIsSubmitting(false);
      return;
    }

    const post: Post = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: 'u-me',
      authorName: 'Alex Rivers',
      authorRole: 'Student',
      title: newPost.title,
      content: newPost.content,
      upvotes: 0,
      comments: 0,
      tags: newPost.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      createdAt: 'Just now',
      imageUrl: newPost.imageUrl || undefined
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', tags: '', imageUrl: '' });
    setShowPostModal(false);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{university} Hub</h2>
          <p className="text-slate-500">Discuss subjects, exams, and campus life.</p>
        </div>
        <button 
          onClick={() => setShowPostModal(true)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          New Discussion
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-200 transition-all group">
            <div className="flex gap-6">
              <div className="flex flex-col items-center gap-2">
                <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <i className="fa-solid fa-chevron-up text-xl"></i>
                </button>
                <span className="font-bold text-slate-700">{post.upvotes}</span>
                <button className="text-slate-400 hover:text-rose-600 transition-colors">
                  <i className="fa-solid fa-chevron-down text-xl"></i>
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                  <span className={`px-2 py-0.5 rounded ${post.authorRole === 'Teacher' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                    {post.authorRole}
                  </span>
                  <span>• Posted by {post.authorName}</span>
                  <span>• {post.createdAt}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {post.content}
                </p>
                {post.imageUrl && (
                  <div className="mb-4 rounded-2xl overflow-hidden border border-slate-100 max-h-96">
                    <img src={post.imageUrl} alt="Post Attachment" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600">
                    <i className="fa-regular fa-message"></i>
                    {post.comments} Comments
                  </button>
                  <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600">
                    <i className="fa-solid fa-share-nodes"></i>
                    Share
                  </button>
                  <div className="flex gap-2 ml-auto">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Start a Discussion</h3>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="What's on your mind?"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Content</label>
                <textarea 
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]"
                  placeholder="Elaborate on your topic..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Attachment (Optional)</label>
                {!newPost.imageUrl ? (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all bg-slate-50"
                  >
                    <i className="fa-solid fa-image text-2xl mb-2"></i>
                    <span className="text-sm font-bold">Add Image to Discussion</span>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </button>
                ) : (
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-200">
                    <img src={newPost.imageUrl} className="w-full h-48 object-cover" alt="Preview" />
                    <button 
                      onClick={() => setNewPost({...newPost, imageUrl: ''})}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fa-solid fa-trash-can text-sm"></i>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={newPost.tags}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="CS, Homework, Exams"
                />
              </div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                <i className="fa-solid fa-shield-halved text-amber-500 mt-1"></i>
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                  <strong>Notera Moderation:</strong> Images and text are scanned by AI for harassment, academic dishonesty, and non-educational NSFW content.
                </p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setShowPostModal(false)}
                className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handlePostSubmit}
                disabled={isSubmitting}
                className="flex-[2] py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
              >
                {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Publish Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
