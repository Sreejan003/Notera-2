
import React, { useState, useRef, useEffect } from 'react';
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
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Lab Toggle Header */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 w-fit mx-auto shadow-sm">
        <button 
          onClick={() => setActiveMode('quiz')}
          className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeMode === 'quiz' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <i className="fa-solid fa-list-check"></i> Quiz Engine
        </button>
        <button 
          onClick={() => setActiveMode('chat')}
          className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeMode === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <i className="fa-solid fa-square-root-variable"></i> Math Doubt Solver
        </button>
      </div>

      {activeMode === 'quiz' ? (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-4">Quiz AI</h2>
              <p className="text-indigo-100 mb-8 max-w-lg text-lg">Powered by a high-precision mathematical model for rigorous academic testing.</p>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex gap-2">
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer font-bold text-white appearance-none"
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
                    placeholder="Topic (e.g. Calculus II, Neural Networks)"
                    className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl placeholder:text-indigo-200 outline-none focus:ring-2 focus:ring-white/50 text-lg font-bold text-white"
                  />
                </div>
                <button 
                  onClick={startQuizGeneration}
                  disabled={isLoading || !topic}
                  className="px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black hover:bg-indigo-50 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02]"
                >
                  {isLoading ? <i className="fa-solid fa-atom fa-spin"></i> : <><i className="fa-solid fa-bolt"></i> Generate Quiz</>}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-4 bg-rose-500/20 border border-rose-500/30 rounded-xl text-white text-sm font-bold flex items-center gap-3">
                  <i className="fa-solid fa-circle-exclamation"></i> {error}
                </div>
              )}
            </div>
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          {quiz && !showResult && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-1">Question {currentQuestion + 1} of {quiz.length}</h3>
                  <p className="text-slate-400 text-xs font-bold">Topic: {topic}</p>
                </div>
                <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-700 ease-out shadow-sm" 
                    style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <h4 className="text-2xl font-black text-slate-800 mb-10 leading-tight">{quiz[currentQuestion].question}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quiz[currentQuestion].options.map((option, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left px-8 py-6 rounded-[1.5rem] border-2 transition-all group flex items-center gap-5 ${
                      answers[currentQuestion] === idx 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100' 
                      : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${
                      answers[currentQuestion] === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-bold text-slate-700 text-lg leading-snug">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showResult && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 text-center shadow-xl animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 transform -rotate-6">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <h3 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">Quiz Results</h3>
              <p className="text-slate-500 mb-10 font-medium">Model Evaluation Complete for {topic}.</p>
              
              <div className="inline-block px-16 py-8 bg-slate-50 rounded-[2rem] mb-12 border border-slate-100 shadow-inner">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Final Proficiency</p>
                <h4 className="text-7xl font-black text-indigo-600">{calculateScore()}%</h4>
              </div>

              <div className="space-y-6 text-left max-w-2xl mx-auto">
                <h5 className="font-black text-slate-800 text-lg px-2 flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-indigo-600"></i> Step-by-Step Review
                </h5>
                {quiz?.map((q, idx) => (
                  <div key={idx} className={`p-8 rounded-[1.5rem] border-2 ${answers[idx] === q.correctAnswer ? 'border-emerald-100 bg-emerald-50/20' : 'border-rose-100 bg-rose-50/20'}`}>
                    <p className="font-black text-slate-800 mb-4 text-lg">
                      <span className="text-slate-400 mr-2">Q{idx+1}.</span>
                      {q.question}
                    </p>
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm whitespace-pre-wrap">
                      <p className="text-sm italic text-slate-700 leading-relaxed">
                        <span className="font-black text-indigo-600 not-italic block mb-1">Analytical Explanation:</span>
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => { setQuiz(null); setError(null); }}
                className="mt-16 px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
              >
                New Assessment
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 flex flex-col h-[70vh] shadow-xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          {/* Chat Header */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
                <i className="fa-solid fa-calculator"></i>
              </div>
              <div>
                <h3 className="font-black text-slate-800">Math Reasoning Engine</h3>
                <p className="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Gemini 3 Pro Model Integrated
                </p>
              </div>
            </div>
            <button 
              onClick={() => setMessages([])}
              className="text-slate-400 hover:text-rose-500 transition-colors font-bold text-sm"
            >
              Reset Logic
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center text-4xl">
                  <i className="fa-solid fa-terminal"></i>
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 mb-2">Step-by-Step Doubt Solver</h4>
                  <p className="text-slate-400 text-sm max-w-sm font-medium">Input complex problems, equations, or concepts. Our mathematical model will break them down for you.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Explain Chain Rule', 'Derive Quadratic Formula', 'NP-Hard vs NP-Complete'].map(suggestion => (
                    <button 
                      key={suggestion}
                      onClick={() => setChatInput(suggestion)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-6 rounded-3xl font-medium shadow-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none font-bold' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none font-medium text-lg'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-6 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Calculating solution...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="p-8 bg-white border-t border-slate-100">
            <form onSubmit={handleChatSubmit} className="flex gap-4">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Enter mathematical problem or course doubt..."
                className="flex-1 px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all text-slate-900"
              />
              <button 
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
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
