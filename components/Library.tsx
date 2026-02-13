
import React from 'react';
import { MOCK_BOOKS } from '../constants';

const Library: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
        <div className="relative z-10 flex-1">
          <span className="inline-block px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-full mb-4 uppercase tracking-widest">
            Partner Program
          </span>
          <h2 className="text-3xl font-bold text-white mb-4">University Reference Library</h2>
          <p className="text-slate-400 max-w-lg mb-8">Notera partners with global academic publishers to bring you discounted textbooks and verified learning resources. Proceeds support student campus initiatives.</p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all">
              Browse Categories
            </button>
            <button className="px-6 py-3 border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
              Request a Book
            </button>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <h4 className="text-indigo-400 font-bold text-2xl mb-1">15k+</h4>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Digital Titles</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <h4 className="text-emerald-400 font-bold text-2xl mb-1">20%</h4>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Student Discount</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => <img key={i} className="w-8 h-8 rounded-full border-2 border-slate-900" src={`https://picsum.photos/seed/b${i}/100/100`} />)}
              </div>
              <p className="text-slate-400 text-xs">Used by 400+ students this semester</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <i className="fa-solid fa-bookmark text-indigo-600"></i>
          Recommended for your Courses
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_BOOKS.map((book) => (
            <div key={book.id} className="bg-white rounded-2xl border border-slate-200 p-5 group hover:border-indigo-500 transition-all flex flex-col">
              <div className="h-56 bg-slate-100 rounded-xl mb-4 overflow-hidden shadow-inner">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{book.subject}</span>
                <h4 className="font-bold text-slate-800 mt-1 mb-1 line-clamp-2">{book.title}</h4>
                <p className="text-xs text-slate-500 mb-4">by {book.author}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="font-bold text-slate-900">{book.price}</span>
                <a 
                  href={book.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-50 text-indigo-600 font-bold text-xs rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
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
