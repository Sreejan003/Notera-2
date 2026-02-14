
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { User, AcademicStats, Post } from '../types';

interface DashboardProps {
  user: User;
  isDarkMode?: boolean;
  onTabChange?: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, isDarkMode, onTabChange }) => {
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [liveStats, setLiveStats] = useState({ raised: 0, resolved: 0 });

  useEffect(() => {
    // Load doubts from storage to calculate real stats
    const storedDoubts = localStorage.getItem('notera_doubts');
    if (storedDoubts) {
      const doubts: Post[] = JSON.parse(storedDoubts);
      setLiveStats({
        raised: doubts.length,
        resolved: doubts.filter(d => d.isResolved).length
      });
    }
  }, []);

  // Performance Data
  const stats: AcademicStats = {
    totalQuizzes: 156,
    studentQuizzes: 120,
    teacherQuizzes: 36,
    doubtsRaised: liveStats.raised || 89,
    doubtsResolved: liveStats.resolved || 72
  };

  const pendingDoubts = stats.doubtsRaised - stats.doubtsResolved;

  const chartTextColor = isDarkMode ? '#7AB2B2' : '#09637E';
  const gridColor = isDarkMode ? '#033b4b' : '#EBF4F6';

  const AdminView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-brand-primary dark:text-white tracking-tight">System Overview</h2>
          <p className="text-brand-tertiary font-medium">Monitoring university performance metrics across all departments.</p>
        </div>
        <select 
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-white dark:bg-dark-card border-2 border-brand-tertiary/20 px-6 py-3 rounded-2xl font-black text-sm outline-none focus:border-brand-primary transition-all text-brand-primary dark:text-white shadow-sm"
        >
          {['All Departments', 'Computer Science', 'Electrical Engineering', 'Physics', 'Mathematics', 'Biology'].map(dept => <option key={dept}>{dept}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Students', value: '4,281', icon: 'fa-users', color: 'rgb(9, 99, 126)' },
          { label: 'Doubts Resolved', value: `${stats.doubtsResolved}/${stats.doubtsRaised}`, icon: 'fa-check-circle', color: 'rgb(8, 131, 149)' },
          { label: 'Avg Attendance', value: '92%', icon: 'fa-user-check', color: 'rgb(122, 178, 178)' },
          { label: 'Quiz Completion', value: '78%', icon: 'fa-tasks', color: 'rgb(9, 99, 126)' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-dark-card p-8 rounded-[2rem] border border-brand-tertiary/10 dark:border-dark-border shadow-sm">
            <div className="w-12 h-12 bg-brand-surface dark:bg-brand-primary/20 rounded-xl flex items-center justify-center mb-4" style={{ color: stat.color }}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <p className="text-[10px] font-black uppercase text-brand-tertiary tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-2xl font-black text-brand-primary dark:text-white">{stat.value}</h4>
          </div>
        ))}
      </div>
    </div>
  );

  const TeacherView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-brand-primary p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">Professor Portal</h2>
          <p className="text-brand-surface mb-8 max-w-md font-medium">Manage curriculum and resolve critical student doubts in real-time.</p>
          <div className="flex gap-4">
            <button onClick={() => onTabChange?.('ailab')} className="bg-white text-brand-primary px-8 py-3 rounded-2xl font-black text-sm hover:bg-brand-surface transition-all shadow-lg active:scale-95">Create Class Test</button>
            <button onClick={() => onTabChange?.('doubts')} className="bg-brand-secondary/30 text-white border border-white/20 px-8 py-3 rounded-2xl font-black text-sm hover:bg-white/10 transition-all active:scale-95">Review Doubts</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl font-black tracking-tighter">TEACH</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-dark-card p-10 rounded-[2.5rem] border border-brand-tertiary/10 dark:border-dark-border shadow-sm">
          <h3 className="text-xl font-black text-brand-primary dark:text-white mb-8">Test Analytics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'Test 1', avg: 78 }, { name: 'Test 2', avg: 85 }, { name: 'Test 3', avg: 72 }, { name: 'Test 4', avg: 91 }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 12}} />
                <Bar dataKey="avg" fill="rgb(8, 131, 149)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card p-10 rounded-[2.5rem] border border-brand-tertiary/10 dark:border-dark-border shadow-sm relative">
          <h3 className="text-xl font-black text-brand-primary dark:text-white mb-8">Doubt Status</h3>
          <div className="flex items-center justify-center h-64 relative">
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-8">
                <span className="text-4xl font-black text-brand-secondary">{pendingDoubts}</span>
                <span className="text-[10px] font-black text-brand-tertiary uppercase tracking-widest">Pending</span>
             </div>
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={[{ name: 'Resolved', value: stats.doubtsResolved }, { name: 'Pending', value: pendingDoubts }]} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                   <Cell fill="rgb(122, 178, 178)" />
                   <Cell fill="rgb(9, 99, 126)" strokeWidth={0} />
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const StudentView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-dark-card p-10 rounded-[2.5rem] border border-brand-tertiary/10 dark:border-dark-border flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h2 className="text-4xl font-black text-brand-primary dark:text-white mb-2 tracking-tight">Academic Pulse</h2>
          <p className="text-brand-tertiary font-medium text-lg">Your study streak is at 14 days. Keep it up!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total Quizzes', value: stats.totalQuizzes, icon: 'fa-vial' },
          { label: 'Professor Tests', value: stats.teacherQuizzes, icon: 'fa-chalkboard-user' },
          { label: 'Avg Mastery %', value: '88%', icon: 'fa-graduation-cap' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-brand-tertiary/10 dark:border-dark-border shadow-sm transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-brand-surface dark:bg-brand-primary/20 text-brand-secondary rounded-xl flex items-center justify-center mb-4 text-xl">
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <p className="text-[10px] font-black uppercase text-brand-tertiary tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black text-brand-primary dark:text-white">{stat.value}</h4>
          </div>
        ))}
      </div>
      
      <div className="bg-white dark:bg-dark-card p-10 rounded-[2.5rem] border border-brand-tertiary/10 dark:border-dark-border shadow-sm">
        <h3 className="text-xl font-black text-brand-primary dark:text-white mb-8">Personal Performance Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[{ name: 'Wk 1', score: 65 }, { name: 'Wk 2', score: 72 }, { name: 'Wk 3', score: 85 }, { name: 'Wk 4', score: 88 }]}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(8, 131, 149)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="rgb(8, 131, 149)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 12}} domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="rgb(9, 99, 126)" strokeWidth={5} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-20">
      {user.role === 'admin' && <AdminView />}
      {user.role === 'teacher' && <TeacherView />}
      {user.role === 'student' && <StudentView />}
    </div>
  );
};

export default Dashboard;
