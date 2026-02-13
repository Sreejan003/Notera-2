
import React from 'react';
import { MOCK_NOTES } from '../constants';

const NotesSection: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Study Repository</h2>
          <p className="text-slate-500">Find and share high-quality lecture notes.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search subjects..."
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
            />
          </div>
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
            <i className="fa-solid fa-arrow-up-from-bracket"></i>
            Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_NOTES.map((note) => (
          <div key={note.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="h-40 overflow-hidden relative">
              <img src={note.previewUrl} alt={note.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                {note.fileSize}
              </div>
            </div>
            <div className="p-5">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{note.subject}</span>
              <h3 className="font-bold text-slate-800 mt-1 mb-3 line-clamp-2 h-10">{note.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                  {note.author[0]}
                </div>
                <span className="text-xs text-slate-500 font-medium">By {note.author}</span>
              </div>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <i className="fa-solid fa-star text-amber-400"></i>
                  <span className="font-bold text-slate-600">{note.rating}</span>
                </div>
                <button className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline">
                  <i className="fa-solid fa-download"></i>
                  {note.downloads}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesSection;
