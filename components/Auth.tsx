
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    university: '',
    age: '',
    classOrDept: '',
    avatar: 'https://picsum.photos/seed/default/200/200'
  });

  // Database Simulation using localStorage
  const getUsers = (): any[] => {
    const data = localStorage.getItem('notera_db_users');
    return data ? JSON.parse(data) : [];
  };

  const saveUser = (user: any) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('notera_db_users', JSON.stringify(users));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (role === 'admin') {
      // Static Admin Login
      if (formData.email === 'admin' && formData.password === 'admin123') {
        onLogin({
          id: 'admin-001',
          name: 'System Administrator',
          role: 'admin',
          university: 'Global Admin Hub',
          avatar: 'https://ui-avatars.com/api/?name=Admin&background=rose&color=fff',
          age: 35,
          classOrDept: 'Management'
        });
      } else {
        setError('Invalid Admin credentials.');
      }
      return;
    }

    if (isLogin) {
      // Login Logic
      const users = getUsers();
      const existingUser = users.find(u => u.email === formData.email && u.password === formData.password && u.role === role);
      
      if (existingUser) {
        onLogin(existingUser);
      } else {
        setError('Invalid email, password, or role selection.');
      }
    } else {
      // Registration Logic
      const users = getUsers();
      if (users.find(u => u.email === formData.email)) {
        setError('Email already exists. Please login.');
        return;
      }

      const newUser: User & { password?: string, email: string } = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        university: formData.university,
        avatar: formData.avatar,
        age: parseInt(formData.age) || 0,
        classOrDept: formData.classOrDept
      };

      saveUser(newUser);
      onLogin(newUser);
    }
  };

  const bgClasses = {
    student: 'bg-indigo-600',
    teacher: 'bg-emerald-600',
    admin: 'bg-rose-600'
  };

  const focusClasses = {
    student: 'focus:border-indigo-600',
    teacher: 'focus:border-emerald-600',
    admin: 'focus:border-rose-500'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-indigo-100">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Left Visual Panel */}
        <div className={`${bgClasses[role]} p-16 text-white flex flex-col justify-between relative overflow-hidden transition-colors duration-700`}>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-black mb-10 shadow-lg">N</div>
            <h1 className="text-5xl font-black mb-6 tracking-tight leading-none">Notera</h1>
            <p className="text-white/80 text-xl leading-relaxed max-w-sm">
              {role === 'student' && "Your academic journey starts here. Discuss, share, and solve with your campus peers."}
              {role === 'teacher' && "Empower the next generation. Manage resources and mentor students in your university hub."}
              {role === 'admin' && "Full control of the Notera ecosystem. Moderate, manage, and scale the university network."}
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20 bg-slate-200 overflow-hidden"><img src={`https://picsum.photos/seed/${i+10}/50/50`} /></div>)}
              </div>
              <span className="text-sm font-bold">Join 5,000+ users</span>
            </div>
            <p className="text-xs text-white/60">Verified academic platform for higher education.</p>
          </div>

          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
        </div>

        {/* Right Auth Form */}
        <div className="p-16 flex flex-col bg-white overflow-y-auto max-h-screen">
          <div className="mb-10">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-8">
              {(['student', 'teacher', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setStep(1); setError(null); }}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                    role === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-end mb-2">
              <h2 className="text-3xl font-black text-slate-900">
                {role === 'admin' ? 'Admin Login' : (isLogin ? 'Welcome Back' : 'Create Account')}
              </h2>
              {role !== 'admin' && (
                <button 
                  onClick={() => { setIsLogin(!isLogin); setStep(1); setError(null); }}
                  className="text-sm font-black text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {isLogin ? 'New here? Sign up' : 'Already a member? Login'}
                </button>
              )}
            </div>
            <p className="text-slate-500 font-medium">Please enter your credentials to continue.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleAuthAction} className="flex-1 space-y-5">
            {role === 'admin' ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Admin Username</label>
                  <input 
                    required
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-rose-500 font-bold transition-all text-slate-900"
                    placeholder="admin"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Password</label>
                  <input 
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-rose-500 font-bold transition-all text-slate-900"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 hover:scale-[1.02] active:scale-95 transition-all">
                  Access Terminal
                </button>
              </div>
            ) : isLogin ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-slate-900`}
                    placeholder="name@university.edu"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Password</label>
                  <input 
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-slate-900`}
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className={`w-full py-5 ${bgClasses[role]} text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all`}>
                  Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              </div>
            ) : (
              // Sign Up Steps
              <div className="space-y-5">
                {step === 1 ? (
                  <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative group">
                        <img src={formData.avatar} className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-100 shadow-md group-hover:opacity-75 transition-all" />
                        <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white/90 p-2 rounded-full shadow-lg"><i className="fa-solid fa-camera text-slate-900"></i></div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Profile Photo</p>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Full Name</label>
                      <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-slate-900`} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Email Address</label>
                      <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-slate-900`} />
                    </div>
                    <button type="button" onClick={() => setStep(2)} className={`w-full py-5 ${bgClasses[role]} text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2`}>
                      Next Step <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">University / College</label>
                      <input required type="text" value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})} className={`w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-slate-900`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Age</label>
                        <input required type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className={`w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-slate-900`} />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">{role === 'student' ? 'Class/Year' : 'Department'}</label>
                        <input required type="text" value={formData.classOrDept} onChange={(e) => setFormData({...formData, classOrDept: e.target.value})} className={`w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-slate-900`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Set Password</label>
                      <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className={`w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-slate-900`} />
                    </div>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">Back</button>
                      <button type="submit" className={`flex-[2] py-5 ${bgClasses[role]} text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all`}>Create Account</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
