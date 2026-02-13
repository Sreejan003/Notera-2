
import React from 'react';
import { MOCK_BOOKS } from '../constants';

const Library: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative shadow-2xl">
        <div className="relative z-10 flex-1">
          <span className="inline-block px-4 py-1.5 bg-indigo-500 text-white text-[10px] font-black rounded-full mb-6 uppercase tracking-widest">
            Academic Partner Program
          </span>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">University Reference Library</h2>
          <p className="text-slate-400 max-w-lg mb-10 text-lg leading-relaxed font-medium">Notera partners with Indian academic publishers to bring you essential textbooks at verified student rates. Support your campus while you study.</p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl hover:scale-[1.02]">
              Browse Subjects
            </button>
            <button className="px-8 py-4 border-2 border-slate-700 text-white font-black rounded-2xl hover:bg-slate-800 transition-all">
              Request Stock
            </button>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h4 className="text-indigo-400 font-black text-3xl mb-1">15k+</h4>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Verified Titles</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h4 className="text-emerald-400 font-black text-3xl mb-1">₹ Off</h4>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Student Discount</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => <img key={i} className="w-10 h-10 rounded-full border-2 border-slate-900" src={`https://picsum.photos/seed/b${i}/100/100`} />)}
              </div>
              <p className="text-slate-400 text-sm font-bold">Used by 4,000+ Indian students daily</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-bookmark"></i>
          </div>
          Curated for Indian Curriculum
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_BOOKS.map((book) => (
            <div key={book.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 group hover:border-indigo-500 transition-all flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1">
              <div className="h-64 bg-slate-50 rounded-2xl mb-6 overflow-hidden shadow-inner flex items-center justify-center">
                <img src={book.image} alt={book.title} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">{book.subject}</span>
                <h4 className="font-black text-slate-900 mt-2 mb-1 line-clamp-2 leading-snug">{book.title}</h4>
                <p className="text-xs text-slate-500 font-bold mb-4">by {book.author}</p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <span className="font-black text-xl text-slate-900">{book.price}</span>
                <a 
                  href={book.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg"
                >
                  Buy Now
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
