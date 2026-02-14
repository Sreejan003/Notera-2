
import React from 'react';
import { MOCK_BOOKS, UPCOMING_BOOKS } from '../constants';

const Library: React.FC = () => {
  return (
    <div className="space-y-16 animate-in fade-in duration-500 pb-20 theme-transition">
      <div className="bg-slate-900 dark:bg-indigo-950 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative shadow-2xl transition-colors">
        <div className="relative z-10 flex-1">
          <span className="inline-block px-4 py-1.5 bg-indigo-500 text-white text-[10px] font-black rounded-full mb-6 uppercase tracking-widest">
            Verified Partner Library
          </span>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight tracking-tighter">Campus Reference Hub</h2>
          <p className="text-slate-400 dark:text-indigo-200 max-w-lg mb-10 text-lg leading-relaxed font-medium">Notera works directly with academic publishers to provide student-exclusive rates on mandatory textbooks. </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl hover:scale-[1.02]">
              Browse All
            </button>
            <button className="px-8 py-4 border-2 border-slate-700 dark:border-indigo-800 text-white font-black rounded-2xl hover:bg-slate-800 dark:hover:bg-indigo-900 transition-all">
              Request Stock
            </button>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h4 className="text-indigo-400 font-black text-3xl mb-1">15k+</h4>
            <p className="text-slate-500 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest">Library Titles</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h4 className="text-emerald-400 font-black text-3xl mb-1">₹ Off</h4>
            <p className="text-slate-500 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest">Member Pricing</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => <img key={i} className="w-10 h-10 rounded-full border-2 border-slate-900" src={`https://picsum.photos/seed/lib${i}/100/100`} alt="user" />)}
              </div>
              <p className="text-slate-400 dark:text-indigo-200 text-sm font-bold">Trusted by 4,000+ Indian students daily</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Available Books */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-bookmark"></i>
            </div>
            Core Curriculum Reference
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
            Official Store
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_BOOKS.map((book) => (
            <div key={book.id} className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 group hover:border-indigo-500 transition-all flex flex-col shadow-sm hover:shadow-2xl hover:-translate-y-2">
              <div className="h-72 bg-slate-50 dark:bg-slate-900 rounded-2xl mb-6 overflow-hidden shadow-inner flex items-center justify-center relative p-6">
                <img src={book.image} alt={book.title} className="max-h-full max-w-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <div className="bg-indigo-600 text-white p-2.5 rounded-xl text-[10px] font-black text-center shadow-xl">
                    Campus Priority Stock
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">{book.subject}</span>
                <h4 className="font-black text-slate-900 dark:text-white mt-2 mb-1 line-clamp-2 leading-snug tracking-tight">{book.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-4">by {book.author}</p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800 transition-colors">
                <span className="font-black text-2xl text-slate-900 dark:text-white">{book.price}</span>
                <a 
                  href={book.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white font-black text-xs rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg"
                >
                  Buy Now
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-hourglass-half"></i>
          </div>
          Restocking Soon
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {UPCOMING_BOOKS.map((book) => (
            <div key={book.id} className="bg-slate-50/50 dark:bg-slate-900/30 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col group relative overflow-hidden transition-all grayscale opacity-70 hover:grayscale-0 hover:opacity-100">
              <div className="h-64 rounded-2xl mb-6 overflow-hidden flex items-center justify-center p-6 bg-white dark:bg-slate-800/50 shadow-inner">
                <img src={book.image} alt={book.title} className="max-h-full max-w-full object-contain p-2" />
              </div>
              
              <div className="flex-1">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-md">{book.subject}</span>
                <h4 className="font-black text-slate-700 dark:text-slate-300 mt-2 mb-1 line-clamp-2 leading-snug">{book.title}</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-4">by {book.author}</p>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-slate-800 transition-colors">
                <span className="text-[10px] font-black text-amber-600 uppercase">Procuring Stock</span>
                <button 
                  className="px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-300 font-black text-xs rounded-xl border border-slate-200 dark:border-slate-700 hover:text-indigo-600 transition-all flex items-center gap-2"
                  onClick={() => alert(`We'll notify you when ${book.title} is available!`)}
                >
                  Alert Me
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
