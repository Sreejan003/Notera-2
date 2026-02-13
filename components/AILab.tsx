
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { generateQuiz, solveDoubt } from '../services/geminiService';
import { QuizQuestion } from '../types';

const AILab: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'quiz' | 'chat'>('quiz');
  
  // Quiz States
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Chat States
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startQuizGeneration = async () => {
    if (!topic) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateQuiz(subject, topic);
      if (result && result.length > 0) {
        setQuiz(result);
        setAnswers([]);
        setCurrentQuestion(0);
        setShowResult(false);
      } else {
        throw new Error("Received empty quiz data.");
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong generating the quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = idx;
    setAnswers(newAnswers);

    if (currentQuestion < (quiz?.length || 0) - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    answers.forEach((ans, idx) => {
      if (ans === quiz[idx].correctAnswer) correct++;
    });
    return Math.round((correct / quiz.length) * 100);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const response = await solveDoubt(subject, userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error: Could not connect to the mathematical reasoning engine." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 theme-transition">
      {/* Lab Toggle Header */}
      <div className="flex bg-white dark:bg-dark-card p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit mx-auto shadow-sm transition-colors">
        <button 
          onClick={() => setActiveMode('quiz')}
          className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeMode === 'quiz' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
        >
          <i className="fa-solid fa-list-check"></i> Quiz Engine
        </button>
        <button 
          onClick={() => setActiveMode('chat')}
          className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeMode === 'chat' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
        >
          <span className="text-lg">Σ</span> Prof Doubt Solver
        </button>
      </div>

      {activeMode === 'quiz' ? (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden transition-all">
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-4 tracking-tighter">AI Quiz <span className="text-indigo-400">Companion</span></h2>
              <p className="text-indigo-100 mb-8 max-w-lg text-lg font-medium leading-relaxed italic">
                Welcome to your personal growth space. Explore new concepts and sharpen your skills with delight. Discover the joy of learning!
              </p>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex gap-2">
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer font-bold text-white appearance-none transition-all"
                  >
                    <option className="text-slate-800">Mathematics</option>
                    <option className="text-slate-800">Computer Science</option>
                    <option className="text-slate-800">Physics</option>
                    <option className="text-slate-800">Biology</option>
                    <option className="text-slate-800">Economics</option>
                  </select>
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="What shall we learn today?"
                    className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl placeholder:text-indigo-200 outline-none focus:ring-2 focus:ring-white/50 text-lg font-bold text-white transition-all"
                  />
                </div>
                <button 
                  onClick={startQuizGeneration}
                  disabled={isLoading || !topic}
                  className="px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black hover:bg-indigo-50 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95"
                >
                  {isLoading ? <i className="fa-solid fa-atom fa-spin"></i> : <><i className="fa-solid fa-sparkles text-indigo-500"></i> Start Learning</>}
                </button>
              </div>
            </div>
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          {quiz && !showResult && (
            <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm animate-in zoom-in-95 duration-300 transition-colors">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Module {currentQuestion + 1} of {quiz.length}</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Topic: {topic}</p>
                </div>
                <div className="w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-700 ease-out" style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}></div>
                </div>
              </div>
              
              <div className="text-2xl font-black text-slate-800 dark:text-white mb-10 leading-tight markdown-content">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {quiz[currentQuestion].question}
                </ReactMarkdown>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quiz[currentQuestion].options.map((option, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left px-8 py-6 rounded-[1.5rem] border-2 transition-all group flex items-center gap-5 ${
                      answers[currentQuestion] === idx 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:border-indigo-500' 
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-200 dark:hover:border-indigo-500/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${
                      answers[currentQuestion] === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="font-bold text-slate-700 dark:text-slate-300 text-lg leading-snug markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {option}
                      </ReactMarkdown>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex flex-col h-[75vh] shadow-xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 transition-colors">
          {/* Chat Header */}
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-dark-card sticky top-0 z-10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                Σ
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-white tracking-tight">Academic Tutor AI</h3>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  LaTeX Engine Active
                </p>
              </div>
            </div>
            <button 
              onClick={() => setMessages([])}
              className="text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-colors font-black text-[10px] uppercase tracking-widest"
            >
              Reset Session
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950/20">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-300 dark:text-indigo-700 rounded-full flex items-center justify-center text-4xl">
                  <i className="fa-solid fa-terminal"></i>
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">STEM Doubts Engine</h4>
                  <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm font-medium">Ask complex problems, derivations, or logical proofs. Fully rendered mathematical signs in textbook style.</p>
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-6 rounded-3xl shadow-sm leading-relaxed markdown-content transition-colors ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none font-bold' 
                  : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none font-medium'
                }`}>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Solving Proof...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="p-8 bg-white dark:bg-dark-card border-t border-slate-100 dark:border-slate-800 transition-colors">
            <form onSubmit={handleChatSubmit} className="flex gap-4">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Find the integral of $\int e^x \sin(x) dx$..."
                className="flex-1 px-6 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-bold transition-all text-slate-900 dark:text-white"
              />
              <button 
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AILab;
