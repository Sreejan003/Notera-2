
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { MOCK_NOTES } from '../constants';
import { Note, User } from '../types';
import { checkContentSafety } from '../services/geminiService';

interface NotesSectionProps {
  user: User;
}

const NotesSection: React.FC<NotesSectionProps> = ({ user }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notera_notes');
    return saved ? JSON.parse(saved) : MOCK_NOTES;
  });

  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadData, setUploadData] = useState({
    title: '',
    subject: 'Computer Science',
    file: null as File | null,
    previewUrl: ''
  });

  const subjects = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Humanities', 'Engineering', 'Economics', 'Biology'];

  // Persist notes to localStorage for communal viewing
  useEffect(() => {
    localStorage.setItem('notera_notes', JSON.stringify(notes));
  }, [notes]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.title || !uploadData.file) {
      alert("Please provide a title and select a file.");
      return;
    }
    
    setIsUploading(true);

    try {
      const safety = await checkContentSafety(uploadData.title);
      if (!safety.safe) {
        alert(`Upload Rejected: ${safety.reason || "The title contains inappropriate language."}`);
        setIsUploading(false);
        return;
      }

      const newNote: Note = {
        id: `n-${Math.random().toString(36).substr(2, 9)}`,
        title: uploadData.title,
        subject: uploadData.subject,
        author: user.name,
        downloads: 0,
        rating: 0,
        previewUrl: uploadData.previewUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400',
        fileSize: `${(uploadData.file!.size / (1024 * 1024)).toFixed(1)} MB`,
        fileUrl: uploadData.previewUrl // Using previewUrl as mock fileUrl
      };

      setNotes(prevNotes => [newNote, ...prevNotes]);
      
      setIsUploading(false);
      setShowUploadModal(false);
      setUploadData({ title: '', subject: 'Computer Science', file: null, previewUrl: '' });
      alert("Material uploaded successfully! It is now visible to all students and faculty.");
    } catch (err) {
      console.error(err);
      alert("An error occurred during the safety check. Please try again.");
      setIsUploading(false);
    }
  };

  const handleDownload = (note: Note) => {
    // If it's a data URL (uploaded file), trigger real download
    if (note.previewUrl && note.previewUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = note.previewUrl;
      link.download = `${note.title.replace(/\s+/g, '_')}_Notera.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update download count
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, downloads: n.downloads + 1 } : n));
    } else {
      // For mock data, simulate download
      alert(`Downloading ${note.title}... (Note: This is a simulation of the PDF download for system-wide mock materials)`);
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, downloads: n.downloads + 1 } : n));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadData(prev => ({ ...prev, file: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadData(prev => ({ ...prev, previewUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredNotes = useMemo(() => {
    let list = notes;
    
    // Applying communal visibility - everyone sees all uploads
    if (searchQuery) {
      list = list.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return list;
  }, [notes, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Study Repository</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">
            Communal repository for shared lecture notes and academic materials.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"></i>
            <input 
              type="text" 
              placeholder="Filter by subject or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-6 py-4 bg-white dark:bg-dark-card border-2 border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-indigo-600 transition-all w-72 font-bold text-slate-900 dark:text-white shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
          >
            <i className="fa-solid fa-cloud-arrow-up"></i> Upload Material
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-2xl hover:border-indigo-400 transition-all animate-in slide-in-from-bottom-4 duration-500">
            <div className="h-48 overflow-hidden relative p-4 bg-slate-50 dark:bg-slate-900/50">
              <img src={note.previewUrl} alt={note.title} className="w-full h-full object-cover rounded-2xl shadow-lg transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-6 right-6 bg-white/90 dark:bg-dark-card/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-white/20">
                {note.fileSize}
              </div>
              <div className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                 <button onClick={() => setActiveNote(note)} className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-black text-xs shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">View Document</button>
              </div>
            </div>
            <div className="p-8">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">{note.subject}</span>
              <h3 className="font-black text-slate-800 dark:text-white mt-3 mb-4 line-clamp-2 h-12 leading-snug">{note.title}</h3>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-indigo-600">{note.author[0]}</div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Shared by {note.author}</span>
              </div>
              <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-black text-slate-700 dark:text-slate-300">
                  <i className="fa-solid fa-star text-amber-400"></i>
                  {note.rating === 0 ? 'New' : note.rating}
                </div>
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
                  <i className="fa-solid fa-download"></i>
                  {note.downloads}
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredNotes.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <i className="fa-solid fa-file-circle-exclamation text-6xl text-slate-200 dark:text-slate-800 mb-6"></i>
            <h3 className="text-2xl font-black text-slate-400 dark:text-slate-600">No matching materials found</h3>
            <p className="text-slate-400 dark:text-slate-600 font-bold mt-2">Try adjusting your search or categories.</p>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {activeNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-slate-900/80 backdrop-blur-md">
           <div className="bg-white dark:bg-dark-card w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 transition-colors">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-dark-card">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg"><i className="fa-solid fa-file-pdf"></i></div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800 dark:text-white">{activeNote.title}</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeNote.subject} • Read Only Access</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <button className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-all"><i className="fa-solid fa-print"></i></button>
                    <button 
                      onClick={() => handleDownload(activeNote)} 
                      className="px-6 h-12 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-xl active:scale-95 transition-transform"
                    >
                      <i className="fa-solid fa-download mr-2"></i> Download PDF
                    </button>
                    <button onClick={() => setActiveNote(null)} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-all"><i className="fa-solid fa-xmark"></i></button>
                 </div>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-950/50 p-10 overflow-y-auto flex justify-center">
                 <div className="w-full max-w-3xl bg-white dark:bg-slate-900 min-h-screen shadow-2xl rounded-lg p-12 flex flex-col items-center justify-center text-center">
                    {activeNote.previewUrl.startsWith('data:image') ? (
                      <img src={activeNote.previewUrl} className="max-w-full rounded-xl shadow-lg mb-8" alt="Preview" />
                    ) : (
                      <i className="fa-solid fa-file-pdf text-6xl text-slate-200 dark:text-slate-800 mb-6"></i>
                    )}
                    <h4 className="text-2xl font-black text-slate-400 dark:text-slate-700">Digital Document Preview</h4>
                    <p className="text-slate-300 dark:text-slate-800 font-bold max-w-xs mt-4 italic">The full text of "{activeNote.title}" is rendered here using Notera's integrated PDF Engine.</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Upload Academic Material</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-8 space-y-6">
              <div className="bg-indigo-50 dark:bg-indigo-500/5 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 mb-4">
                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-bold leading-relaxed">
                  <i className="fa-solid fa-circle-info mr-2"></i>
                  Please ensure your document follows university guidelines. All uploads are reviewed for quality and integrity.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject Category</label>
                <select 
                  value={uploadData.subject} 
                  onChange={(e) => setUploadData({...uploadData, subject: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-slate-900 dark:text-white focus:border-indigo-600 transition-all shadow-sm"
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Document Title</label>
                <input 
                  type="text" 
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-600 transition-all shadow-sm" 
                  placeholder="e.g. Data Structures - Unit 2 Summary" 
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest mb-2">Select File (PDF, Images)</label>
                <div 
                  className="relative group/file cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div className={`w-full px-6 py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${uploadData.file ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
                    {uploadData.previewUrl ? (
                      <img src={uploadData.previewUrl} className="w-24 h-24 object-cover rounded-xl shadow-md mb-2 border-2 border-white dark:border-slate-700" alt="Selected" />
                    ) : (
                      <i className={`fa-solid ${uploadData.file ? 'fa-check-circle text-emerald-500' : 'fa-file-arrow-up text-slate-300 dark:text-slate-700'} text-3xl`}></i>
                    )}
                    <div className="text-center">
                      <p className={`text-sm font-black ${uploadData.file ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {uploadData.file ? uploadData.file.name : "Click to select file"}
                      </p>
                      {uploadData.file && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Ready for upload</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  disabled={isUploading}
                  onClick={() => setShowUploadModal(false)} 
                  className="flex-1 py-4 font-black text-slate-500 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading || !uploadData.file || !uploadData.title}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl disabled:opacity-50 transition-all hover:bg-indigo-700 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing...</>
                  ) : (
                    <><i className="fa-solid fa-cloud-arrow-up"></i> Confirm Upload</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesSection;
