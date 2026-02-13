
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

const Dashboard: React.FC = () => {
  // Initial state set to 0 as requested for new users
  const [metrics, setMetrics] = useState({
    studyHours: 0,
    notesUploaded: 0,
    doubtsSolved: 0,
    quizAccuracy: 0,
    streak: 0
  });

  const [isStudying, setIsStudying] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Simulated Weekly Data starting at 0
  const [weeklyData, setWeeklyData] = useState([
    { name: 'Mon', hours: 0 },
    { name: 'Tue', hours: 0 },
    { name: 'Wed', hours: 0 },
    { name: 'Thu', hours: 0 },
    { name: 'Fri', hours: 0 },
    { name: 'Sat', hours: 0 },
    { name: 'Sun', hours: 0 },
  ]);

  const [improvementData, setImprovementData] = useState([
    { name: 'Week 1', score: 0 },
    { name: 'Week 2', score: 0 },
    { name: 'Week 3', score: 0 },
    { name: 'Week 4', score: 0 },
  ]);

  const toggleStudySession = () => {
    if (!isStudying) {
      setIsStudying(true);
      setStartTime(Date.now());
    } else {
      setIsStudying(false);
      if (startTime) {
        const elapsedHrs = (Date.now() - startTime) / (1000 * 3600);
        const addedHours = Math.max(0.1, Number(elapsedHrs.toFixed(2))); // Minimum 0.1 for demo
        
        setMetrics(prev => ({
          ...prev,
          studyHours: Number((prev.studyHours + addedHours).toFixed(2)),
          streak: prev.streak === 0 ? 1 : prev.streak
        }));

        // Update today's bar in the graph
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayName = days[new Date().getDay()];
        setWeeklyData(prev => prev.map(d => 
          d.name === todayName ? { ...d, hours: Number((d.hours + addedHours).toFixed(2)) } : d
        ));
      }
    }
  };

  const stats = [
    { label: 'Total study hours', value: metrics.studyHours.toString(), unit: 'hrs', icon: 'fa-clock', color: 'indigo' },
    { label: 'Notes uploaded', value: metrics.notesUploaded.toString(), unit: 'docs', icon: 'fa-file-upload', color: 'emerald' },
    { label: 'Doubts solved', value: metrics.doubtsSolved.toString(), unit: 'solved', icon: 'fa-check-circle', color: 'amber' },
    { label: 'Quiz accuracy %', value: metrics.quizAccuracy.toString(), unit: '%', icon: 'fa-bullseye', color: 'rose' },
    { label: 'Streak days', value: metrics.streak.toString(), unit: 'days', icon: 'fa-fire', color: 'orange' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome & Study Action */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Ready to excel?</h2>
          <p className="text-slate-500 font-medium text-lg">Your academic progress is currently at baseline. Start a session to track your growth.</p>
        </div>
        <button 
          onClick={toggleStudySession}
          className={`px-12 py-5 rounded-[1.5rem] font-black text-xl transition-all flex items-center gap-4 shadow-xl ${
            isStudying 
            ? 'bg-rose-500 text-white shadow-rose-100 hover:bg-rose-600' 
            : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02]'
          }`}
        >
          {isStudying ? (
            <><i className="fa-solid fa-stop-circle animate-pulse"></i> Stop Session</>
          ) : (
            <><i className="fa-solid fa-play-circle"></i> Start Study Session</>
          )}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl transition-all group cursor-default">
            <div className={`w-14 h-14 bg-${stat.color}-100 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
              <i className={`fa-solid ${stat.icon} text-xl`}></i>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-900">
              {stat.value} <span className="text-sm font-bold text-slate-400">{stat.unit}</span>
            </h3>
          </div>
        ))}
      </div>

      {/* Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        {/* Weekly Study Hours */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Weekly Study Hours</h3>
              <p className="text-slate-400 text-sm font-medium">Focus time distribution for the current week</p>
            </div>
            <div className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider border border-indigo-100">
              Live Tracker
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', padding: '12px' }} 
                />
                <Bar dataKey="hours" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Improvement */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Learning Curve</h3>
              <p className="text-slate-400 text-sm font-medium">Monthly improvement in performance across modules</p>
            </div>
            {metrics.quizAccuracy > 0 && (
              <div className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-100 flex items-center gap-2">
                <i className="fa-solid fa-arrow-trend-up"></i>
                <span>Improving</span>
              </div>
            )}
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={improvementData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', padding: '12px' }} />
                <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={5} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
