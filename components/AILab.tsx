
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { generateQuiz, solveDoubt } from '../services/geminiService';
import { QuizQuestion, User } from '../types';

interface AILabProps {
  user: User;
}

const AILab: React.FC<AILabProps> = ({ user }) => {
  const isTeacher = user.role === 'teacher';
  const [activeMode, setActiveMode] = useState<'quiz' | 'chat' | 'creator'>(isTeacher ? 'creator' : 'quiz');
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Teacher Creator States
  const [testTitle, setTestTitle] = useState('');
  const [manualQuestions, setManualQuestions] = useState<QuizQuestion[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Chat States
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const verifiedTopics = ['gravitation', 'integration', 'organic chemistry', 'thermodynamics', 'algebra', 'differentiation'];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startQuizGeneration = async () => {
    const promptTopic = activeMode === 'creator' ? testTitle : topic;
    if (!promptTopic) return;

    setIsLoading(true);
    setError(null);
    setQuiz(null); 
    
    // Check if it's a verified topic locally to show badge immediately
    const normalized = promptTopic.toLowerCase().trim();
    setIsVerified(verifiedTopics.includes(normalized));

    try {
      const result = await generateQuiz("Dynamic Academic Subject", promptTopic);
      if (result && Array.isArray(result) && result.length > 0) {
        if (activeMode === 'creator') {
          setManualQuestions(prev => [...prev, ...result]);
        } else {
          setQuiz(result);
          setAnswers([]);
          setCurrentQuestion(0);
          setShowResult(false);
        }
      } else {
        throw new Error("Received malformed quiz data. Try again.");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Something went wrong generating the quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddManualQuestion = () => {
    const newQ: QuizQuestion = {
      question: "Enter question text here",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: "Provide a detailed explanation"
    };
    setManualQuestions([...manualQuestions, newQ]);
  };

  const updateManualQuestion = (index: number, updated: Partial<QuizQuestion>) => {
    const updatedQs = [...manualQuestions];
    updatedQs[index] = { ...updatedQs[index], ...updated };
    setManualQuestions(updatedQs);
  };

  const publishTest = () => {
    if (!testTitle) return alert("Please provide a test title");
    if (manualQuestions.length === 0) return alert("Add at least one question");
    
    setIsPublishing(true);
    
    const newAnnouncement = {
      id: Math.random().toString(36).substr(2, 9),
      title: `CLASS TEST: ${testTitle}`,
      content: `A new assessment is live for ${testTitle}. Professor ${user.name} has prepared ${manualQuestions.length} challenging questions for you. Access the AI Lab to begin.`,
      authorName: user.name,
      createdAt: 'Just now',
      isTest: true
    };

    const storedAnnouncements = JSON.parse(localStorage.getItem('notera_announcements') || '[]');
    localStorage.setItem('notera_announcements', JSON.stringify([newAnnouncement, ...storedAnnouncements]));

    setTimeout(() => {
      setIsPublishing(false);
      setTestTitle('');
      setManualQuestions([]);
      alert("Success! Your class test has been published to the Announcements board.");
    }, 1200);
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
      const response = await solveDoubt("General Academic", userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error: Service unreachable." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 theme-transition">
      <div className="flex bg-white dark:bg-dark-card p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit mx-auto shadow-sm">
        {isTeacher && (
          <button onClick={() => setActiveMode('creator')} className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeMode === 'creator' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-white'}`}>Test Creator</button>
        )}
        <button onClick={() => setActiveMode('quiz')} className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeMode === 'quiz' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-white'}`}>Quiz Engine</button>
        {!isTeacher && (
          <button onClick={() => setActiveMode('chat')} className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeMode === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-white'}`}>Math Doubt Solver</button>
        )}
      </div>

      {activeMode === 'creator' ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Create Class Test</h2>
            <p className="text-slate-500 font-medium mb-8">Build assessments manually or use AI to generate curriculum-aligned questions.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Test Title / Topic</label>
                <input 
                  type="text" 
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-600 transition-all shadow-sm"
                  placeholder="e.g. Data Structures - Midterm Assessment"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={handleAddManualQuestion}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-black hover:bg-slate-200 transition-all border border-transparent hover:border-indigo-500"
                >
                  <i className="fa-solid fa-plus mr-2"></i> Add Manual Question
                </button>
                <button 
                  onClick={startQuizGeneration}
                  disabled={isLoading || !testTitle}
                  className="flex-1 py-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-2xl font-black hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                >
                  {isLoading ? <i className="fa-solid fa-atom fa-spin"></i> : <><i className="fa-solid fa-sparkles mr-2"></i> AI Generate Questions</>}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {manualQuestions.map((q, idx) => (
              <div key={idx} className="bg-white dark:bg-dark-card rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full">Question {idx + 1}</span>
                  <button onClick={() => setManualQuestions(manualQuestions.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-rose-500 transition-colors"><i className="fa-solid fa-trash"></i></button>
                </div>
                <textarea 
                  value={q.question}
                  onChange={(e) => updateManualQuestion(idx, { question: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-white mb-6 resize-none outline-none focus:border-indigo-500"
                  rows={2}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-3">
                      <button 
                        onClick={() => updateManualQuestion(idx, { correctAnswer: oIdx })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${q.correctAnswer === oIdx ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </button>
                      <input 
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...q.options];
                          newOpts[oIdx] = e.target.value;
                          updateManualQuestion(idx, { options: newOpts });
                        }}
                        className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-800 py-2 font-bold text-sm text-slate-600 dark:text-slate-400 outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {manualQuestions.length > 0 && (
            <div className="flex justify-end pt-8 pb-12">
              <button 
                onClick={publishTest}
                disabled={isPublishing}
                className="px-12 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                {isPublishing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-paper-plane"></i> Publish to Announcements</>}
              </button>
            </div>
          )}
        </div>
      ) : activeMode === 'quiz' ? (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-4 tracking-tighter">AI Quiz <span className="text-indigo-400">Companion</span></h2>
              <p className="text-indigo-100 mb-8 max-w-lg text-lg font-medium leading-relaxed italic">Type topics like <span className="text-white font-black underline">Gravitation</span>, <span className="text-white font-black underline">Integration</span>, or <span className="text-white font-black underline">Algebra</span> for professor-verified sets.</p>
              
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startQuizGeneration()}
                  placeholder="Enter topic (e.g., Organic Chemistry, Thermodynamics...)"
                  className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-5 rounded-2xl placeholder:text-indigo-200 outline-none focus:ring-2 focus:ring-white/50 text-xl font-bold text-white transition-all"
                />
                <button onClick={startQuizGeneration} disabled={isLoading || !topic} className="px-10 py-5 bg-white text-indigo-700 rounded-2xl font-black hover:bg-indigo-50 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl">
                  {isLoading ? <i className="fa-solid fa-atom fa-spin"></i> : <><i className="fa-solid fa-sparkles text-indigo-500"></i> Generate</>}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-500/10 p-6 rounded-2xl border border-rose-100 dark:border-rose-900 text-rose-600 font-bold flex items-center gap-4">
              <i className="fa-solid fa-triangle-exclamation"></i>
              {error}
            </div>
          )}

          {quiz && !showResult && (
            <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm animate-in zoom-in-95 transition-colors relative">
              {isVerified && (
                <div className="absolute top-8 right-10 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                   <i className="fa-solid fa-circle-check"></i>
                   <span className="text-[10px] font-black uppercase tracking-widest">Professor Verified</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-10">
                <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Question {currentQuestion + 1} of {quiz.length}</div>
                <div className="w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}></div>
                </div>
              </div>
              <div className="text-2xl font-black text-slate-800 dark:text-white mb-10 leading-tight markdown-content">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{quiz[currentQuestion].question}</ReactMarkdown>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quiz[currentQuestion].options.map((option, idx) => (
                  <button key={idx} onClick={() => handleAnswer(idx)} className="w-full text-left px-8 py-6 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-600 group flex items-center gap-5 transition-all">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white">{String.fromCharCode(65 + idx)}</div>
                    <div className="font-bold text-slate-700 dark:text-slate-300 text-lg leading-snug markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{option}</ReactMarkdown>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {showResult && (
            <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xl">
               <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Assessment Complete</h3>
               <div className="text-7xl font-black text-indigo-600 mb-8">{calculateScore()}%</div>
               <button onClick={() => { setQuiz(null); setTopic(''); setShowResult(false); }} className="px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-indigo-500/20">New Topic</button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex flex-col h-[75vh] shadow-xl overflow-hidden transition-all">
           <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">Σ</div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-white tracking-tight">Academic Tutor AI</h3>
                  <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>LaTeX Engine Active</p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950/20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-6 rounded-3xl shadow-sm leading-relaxed markdown-content ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none font-bold' : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none font-medium'}`}>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isChatLoading && <div className="text-slate-400 animate-pulse text-xs font-black uppercase tracking-widest p-4">Solving Proof...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="p-8 border-t border-slate-100 dark:border-slate-800">
               <form onSubmit={handleChatSubmit} className="flex gap-4">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a formula or question..." className="flex-1 px-6 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all text-slate-900 dark:text-white" />
                  <button type="submit" className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg"><i className="fa-solid fa-paper-plane"></i></button>
               </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AILab;
