
import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';

const AILab: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const startQuizGeneration = async () => {
    if (!topic) return;
    setIsLoading(true);
    const result = await generateQuiz(subject, topic);
    setQuiz(result);
    setAnswers([]);
    setCurrentQuestion(0);
    setShowResult(false);
    setIsLoading(false);
  };

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = idx;
    setAnswers(newAnswers);

    if (currentQuestion < (quiz?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-10 text-white shadow-xl shadow-indigo-200 overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-4">AI Study Lab</h2>
          <p className="text-indigo-100 mb-8 max-w-lg">Generate personalized quizzes and clear doubts instantly using Gemini Pro's advanced reasoning.</p>
          
          <div className="flex flex-col md:flex-row gap-3">
            <select 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer font-bold"
            >
              <option className="text-slate-800">Computer Science</option>
              <option className="text-slate-800">Mathematics</option>
              <option className="text-slate-800">Physics</option>
              <option className="text-slate-800">Biology</option>
              <option className="text-slate-800">History</option>
            </select>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic (e.g. Neural Networks)"
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-xl placeholder:text-indigo-200 outline-none focus:ring-2 focus:ring-white/50 text-lg font-medium"
            />
            <button 
              onClick={startQuizGeneration}
              disabled={isLoading || !topic}
              className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-sparkles"></i> Generate Quiz</>}
            </button>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {quiz && !showResult && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Question {currentQuestion + 1} of {quiz.length}</h3>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500" 
                style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <h4 className="text-2xl font-semibold text-slate-800 mb-8">{quiz[currentQuestion].question}</h4>
          
          <div className="grid grid-cols-1 gap-4">
            {quiz[currentQuestion].options.map((option, idx) => (
              <button 
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left px-6 py-5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="font-medium text-slate-700">{option}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showResult && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            <i className="fa-solid fa-trophy"></i>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mb-2">Quiz Completed!</h3>
          <p className="text-slate-500 mb-8">Great job testing your knowledge on {topic}.</p>
          
          <div className="inline-block px-12 py-6 bg-slate-50 rounded-3xl mb-12">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">YOUR SCORE</p>
            <h4 className="text-6xl font-black text-indigo-600">{calculateScore()}%</h4>
          </div>

          <div className="space-y-4 text-left">
            <h5 className="font-bold text-slate-800 px-2">Review Explanations</h5>
            {quiz?.map((q, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border ${answers[idx] === q.correctAnswer ? 'border-emerald-100 bg-emerald-50/30' : 'border-rose-100 bg-rose-50/30'}`}>
                <p className="font-bold text-slate-800 mb-2">{idx + 1}. {q.question}</p>
                <p className="text-sm text-slate-600 mb-2">
                  <span className="font-bold">Result:</span> {answers[idx] === q.correctAnswer ? '✅ Correct' : '❌ Incorrect'}
                </p>
                <p className="text-sm italic text-indigo-600 font-medium bg-white/50 p-3 rounded-lg border border-indigo-50">
                  <i className="fa-solid fa-lightbulb mr-2"></i>
                  {q.explanation}
                </p>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setQuiz(null)}
            className="mt-12 px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
          >
            Start New Topic
          </button>
        </div>
      )}
    </div>
  );
};

export default AILab;
