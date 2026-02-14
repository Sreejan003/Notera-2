
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
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('notera-theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('notera-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('notera-theme', 'light');
    }
  }, [darkMode]);

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

    // Basic Email Format Validation (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address (e.g., student@university.edu).');
      return;
    }

    if (role === 'admin') {
      if (formData.email === 'admin@notera.com' && formData.password === 'admin123') {
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
      const users = getUsers();
      const existingUser = users.find(u => u.email === formData.email && u.password === formData.password && u.role === role);
      if (existingUser) {
        onLogin(existingUser);
      } else {
        setError('Invalid email, password, or role selection.');
      }
    } else {
      // Additional Sign-up Validations
      const ageVal = parseInt(formData.age);
      if (isNaN(ageVal) || ageVal <= 0) {
        setError('Age must be a positive number.');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      const users = getUsers();
      if (users.find(u => u.email === formData.email)) {
        setError('Email already exists. Please login instead.');
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
        age: ageVal,
        classOrDept: formData.classOrDept
      };
      saveUser(newUser);
      onLogin(newUser);
    }
  };

  const bgClasses = {
    student: 'bg-brand-primary',
    teacher: 'bg-brand-secondary',
    admin: 'bg-brand-primary'
  };

  const focusClasses = {
    student: 'focus:border-brand-primary dark:focus:border-brand-tertiary',
    teacher: 'focus:border-brand-secondary dark:focus:border-brand-tertiary',
    admin: 'focus:border-brand-primary dark:focus:border-brand-tertiary'
  };

  return (
    <div className="min-h-screen bg-brand-surface dark:bg-dark-bg flex items-center justify-center p-6 transition-colors duration-500">
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-8 right-8 w-12 h-12 rounded-2xl bg-white dark:bg-dark-card border border-brand-tertiary/20 dark:border-dark-border text-brand-primary dark:text-brand-tertiary flex items-center justify-center shadow-lg transition-all hover:scale-110"
      >
        <i className={`fa-solid ${darkMode ? 'fa-moon' : 'fa-sun'}`}></i>
      </button>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-dark-card rounded-[3rem] shadow-2xl overflow-hidden border border-brand-tertiary/10 dark:border-dark-border transition-all">
        
        <div className={`${bgClasses[role]} p-16 text-white flex flex-col justify-between relative overflow-hidden transition-colors duration-700`}>
          <div className="relative z-10">
            {/* The Brand Book Logo */}
            <div className="w-20 h-24 bg-brand-secondary rounded-r-2xl border-l-[6px] border-brand-primary flex items-center justify-center text-white text-6xl font-serif shadow-2xl mb-12 relative overflow-hidden transform hover:rotate-2 transition-transform cursor-pointer">
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20"></div>
              <span className="transform -translate-y-1 select-none">N</span>
            </div>
            
            <h1 className="text-5xl font-black mb-6 tracking-tight leading-none">Notera</h1>
            <p className="text-white/80 text-xl leading-relaxed max-w-sm font-medium">
              {role === 'student' && "Your academic journey starts here. Discuss, share, and solve with your campus peers."}
              {role === 'teacher' && "Empower the next generation. Manage resources and mentor students in your university hub."}
              {role === 'admin' && "Full control of the Notera ecosystem. Moderate, manage, and scale the university network."}
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20 bg-brand-primary overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i+20}/50/50`} alt="Avatar" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-bold">Join 5,000+ users</span>
            </div>
            <p className="text-xs text-white/60 font-bold uppercase tracking-widest">Academic Hub Verified</p>
          </div>

          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-secondary/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-tertiary/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="p-16 flex flex-col bg-white dark:bg-dark-card overflow-y-auto max-h-screen transition-colors duration-500">
          <div className="mb-10">
            <div className="flex gap-2 p-1.5 bg-brand-surface dark:bg-dark-bg rounded-2xl mb-8">
              {(['student', 'teacher', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setStep(1); setError(null); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    role === r 
                      ? 'bg-white dark:bg-brand-primary text-brand-primary dark:text-white shadow-sm' 
                      : 'text-brand-tertiary dark:text-slate-500 hover:text-brand-primary dark:hover:text-brand-tertiary'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-end mb-2">
              <h2 className="text-3xl font-black text-brand-primary dark:text-white tracking-tighter">
                {role === 'admin' ? 'Admin Login' : (isLogin ? 'Welcome Back' : 'Create Account')}
              </h2>
              {role !== 'admin' && (
                <button 
                  onClick={() => { setIsLogin(!isLogin); setStep(1); setError(null); }}
                  className="text-sm font-black text-brand-secondary dark:text-brand-tertiary hover:text-brand-primary transition-colors"
                >
                  {isLogin ? 'New here? Sign up' : 'Already a member? Login'}
                </button>
              )}
            </div>
            <p className="text-brand-tertiary font-medium italic">Please enter your academic credentials.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleAuthAction} className="flex-1 space-y-5">
            {role === 'admin' ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Admin Username</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/20 dark:border-dark-border rounded-2xl outline-none focus:border-brand-primary font-bold transition-all text-brand-primary dark:text-white"
                    placeholder="admin@notera.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Password</label>
                  <input 
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/20 dark:border-dark-border rounded-2xl outline-none focus:border-brand-primary font-bold transition-all text-brand-primary dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black shadow-xl shadow-brand-tertiary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Access Terminal
                </button>
              </div>
            ) : isLogin ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/20 dark:border-dark-border rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-brand-primary dark:text-white`}
                    placeholder="name@university.edu"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Password</label>
                  <input 
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/20 dark:border-dark-border rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-brand-primary dark:text-white`}
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className={`w-full py-5 ${bgClasses[role]} text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all`}>
                  Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {step === 1 ? (
                  <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative group">
                        <img src={formData.avatar} className="w-24 h-24 rounded-3xl object-cover border-4 border-brand-tertiary/30 dark:border-dark-border shadow-md group-hover:opacity-75 transition-all" alt="Avatar" />
                        <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white/90 dark:bg-dark-card/90 p-2 rounded-full shadow-lg"><i className="fa-solid fa-camera text-brand-primary dark:text-white"></i></div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                      </div>
                      <p className="text-[10px] text-brand-tertiary mt-2 font-black uppercase tracking-widest">Profile Photo</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Full Name</label>
                      <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/20 dark:border-dark-border rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-brand-primary dark:text-white`} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Email Address</label>
                      <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/20 dark:border-dark-border rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-brand-primary dark:text-white`} />
                    </div>
                    <button type="button" onClick={() => setStep(2)} className={`w-full py-5 ${bgClasses[role]} text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2`}>
                      Next Step <i className="fa-solid fa-arrow-right text-xs"></i>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                    <div>
                      <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">University / College</label>
                      <input required type="text" value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})} className={`w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/20 dark:border-dark-border rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-brand-primary dark:text-white`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Age</label>
                        <input required type="number" min="1" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className={`w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/20 dark:border-dark-border rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-brand-primary dark:text-white`} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">{role === 'student' ? 'Class/Year' : 'Dept'}</label>
                        <input required type="text" value={formData.classOrDept} onChange={(e) => setFormData({...formData, classOrDept: e.target.value})} className={`w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/20 dark:border-dark-border rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-brand-primary dark:text-white`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-brand-tertiary uppercase tracking-widest mb-2">Set Password (Min 6 Chars)</label>
                      <input required type="password" minLength={6} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className={`w-full px-6 py-4 bg-brand-surface dark:bg-dark-bg border-2 border-brand-tertiary/20 dark:border-dark-border rounded-2xl outline-none ${focusClasses[role]} font-bold transition-all text-brand-primary dark:text-white`} />
                    </div>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-brand-surface dark:bg-dark-bg text-brand-tertiary font-black rounded-2xl hover:bg-brand-tertiary/10 transition-all border border-brand-tertiary/20">Back</button>
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
