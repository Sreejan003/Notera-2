
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

interface DashboardProps {
  isDarkMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
  const [metrics, setMetrics] = useState({
    studyHours: 0,
    notesUploaded: 12,
    doubtsSolved: 45,
    quizAccuracy: 88,
    streak: 14
  });

  const [isStudying, setIsStudying] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [weeklyData] = useState([
    { name: 'Mon', hours: 4.5 },
    { name: 'Tue', hours: 3.2 },
    { name: 'Wed', hours: 6.1 },
    { name: 'Thu', hours: 2.8 },
    { name: 'Fri', hours: 5.4 },
    { name: 'Sat', hours: 1.2 },
    { name: 'Sun', hours: 0.5 },
  ]);

  const [improvementData] = useState([
    { name: 'Wk 1', score: 65 },
    { name: 'Wk 2', score: 72 },
    { name: 'Wk 3', score: 85 },
    { name: 'Wk 4', score: 88 },
  ]);

  const toggleStudySession = () => {
    if (!isStudying) {
      setIsStudying(true);
      setStartTime(Date.now());
    } else {
      setIsStudying(false);
      if (startTime) {
        const elapsedHrs = (Date.now() - startTime) / (1000 * 3600);
        const addedHours = Math.max(0.1, Number(elapsedHrs.toFixed(2)));
        setMetrics(prev => ({
          ...prev,
          studyHours: Number((prev.studyHours + addedHours).toFixed(2))
        }));
      }
    }
  };

  const chartTextColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#1e293b' : '#f1f5f9';

  const stats = [
    { label: 'Total study hours', value: metrics.studyHours.toString(), unit: 'hrs', icon: 'fa-clock', color: 'indigo' },
    { label: 'Notes uploaded', value: metrics.notesUploaded.toString(), unit: 'docs', icon: 'fa-file-upload', color: 'emerald' },
    { label: 'Doubts solved', value: metrics.doubtsSolved.toString(), unit: 'solved', icon: 'fa-check-circle', color: 'amber' },
    { label: 'Quiz accuracy %', value: metrics.quizAccuracy.toString(), unit: '%', icon: 'fa-bullseye', color: 'rose' },
    { label: 'Streak days', value: metrics.streak.toString(), unit: 'days', icon: 'fa-fire', color: 'orange' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-dark-card p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm transition-colors">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Academic Focus</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Your progress is automatically synced with department rankings.</p>
        </div>
        <button 
          onClick={toggleStudySession}
          className={`px-12 py-5 rounded-[1.5rem] font-black text-xl transition-all flex items-center gap-4 shadow-xl ${
            isStudying 
            ? 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600' 
            : 'bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02]'
          }`}
        >
          {isStudying ? (
            <><i className="fa-solid fa-stop-circle animate-pulse"></i> Stop Focus</>
          ) : (
            <><i className="fa-solid fa-play-circle"></i> Start Study</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:border-indigo-500/30 transition-all group">
            <div className={`w-14 h-14 bg-${stat.color}-100 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
              <i className={`fa-solid ${stat.icon} text-xl`}></i>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white">
              {stat.value} <span className="text-sm font-bold text-slate-400 dark:text-slate-600">{stat.unit}</span>
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <div className="bg-white dark:bg-dark-card p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Weekly Engagement</h3>
              <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-widest">Hours Logged</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border border-indigo-100 dark:border-indigo-900">
              Department Avg: 4.2h
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 13, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 13}} />
                <Tooltip 
                  cursor={{fill: isDarkMode ? '#1e293b' : '#f8fafc'}} 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#0f172a' : '#fff', 
                    borderRadius: '20px', 
                    border: isDarkMode ? '1px solid #1e293b' : 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                    fontWeight: 'bold', 
                    padding: '12px',
                    color: isDarkMode ? '#fff' : '#000'
                  }} 
                />
                <Bar dataKey="hours" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Academic Trend</h3>
              <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-widest">Cumulative Score %</p>
            </div>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 13, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 13}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#0f172a' : '#fff', 
                    borderRadius: '20px', 
                    border: isDarkMode ? '1px solid #1e293b' : 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                    fontWeight: 'bold', 
                    padding: '12px',
                    color: isDarkMode ? '#fff' : '#000'
                  }} 
                />
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