
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';

const studyData = [
  { name: 'Mon', hours: 4.5 },
  { name: 'Tue', hours: 6.2 },
  { name: 'Wed', hours: 3.8 },
  { name: 'Thu', hours: 7.1 },
  { name: 'Fri', hours: 5.4 },
  { name: 'Sat', hours: 2.0 },
  { name: 'Sun', hours: 1.5 },
];

const improvementData = [
  { name: 'Week 1', score: 65 },
  { name: 'Week 2', score: 72 },
  { name: 'Week 3', score: 70 },
  { name: 'Week 4', score: 85 },
  { name: 'Week 5', score: 82 },
  { name: 'Week 6', score: 91 },
];

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total study hours', value: '30.5', unit: 'hrs', icon: 'fa-clock', color: 'indigo' },
    { label: 'Notes uploaded', value: '14', unit: 'docs', icon: 'fa-file-upload', color: 'emerald' },
    { label: 'Doubts solved', value: '42', unit: 'solved', icon: 'fa-check-circle', color: 'amber' },
    { label: 'Quiz accuracy %', value: '88', unit: '%', icon: 'fa-bullseye', color: 'rose' },
    { label: 'Streak days', value: '12', unit: 'days', icon: 'fa-fire', color: 'orange' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
            <div className={`w-10 h-10 bg-${stat.color}-100 text-${stat.color}-600 rounded-xl flex items-center justify-center mb-4`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {stat.value} <span className="text-sm font-normal text-slate-400">{stat.unit}</span>
            </h3>
          </div>
        ))}
      </div>

      {/* Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Study Hours */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Weekly Study Hours</h3>
              <p className="text-slate-400 text-sm">Focus time distribution</p>
            </div>
            <div className="bg-slate-50 px-3 py-1 rounded-lg text-slate-500 text-xs font-bold">
              THIS WEEK
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Improvement */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Learning Curve</h3>
              <p className="text-slate-400 text-sm">Monthly improvement in quiz scores</p>
            </div>
            <div className="text-emerald-500 text-sm font-bold flex items-center gap-1">
              <i className="fa-solid fa-arrow-up"></i>
              <span>+14%</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={improvementData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={[50, 100]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Suggested Features / Cross-Questions Placeholder */}
      <div className="bg-indigo-600 p-8 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10 max-w-xl">
          <h3 className="text-xl font-bold mb-2">💡 Cross-Questions for Judges</h3>
          <ul className="text-indigo-100 text-sm space-y-2 list-disc pl-4">
            <li>"How should Notera handle verified teacher accounts to distinguish their authority in the forum?"</li>
            <li>"For the 'Local to University' feature, should we implement a Geo-fencing check to ensure only on-campus students can access specific materials?"</li>
            <li>"Regarding 'Affiliated Links', would a 'Direct Library Integration' (showing book availability in the physical library) be more valuable than just commercial links?"</li>
          </ul>
        </div>
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl relative z-10 shrink-0">
          <p className="text-xs font-bold uppercase tracking-wider mb-2">Upcoming Feature</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <span className="font-bold">Campus Hotspots Map</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>
      </div>
    </div>
  );
};

export default Dashboard;
