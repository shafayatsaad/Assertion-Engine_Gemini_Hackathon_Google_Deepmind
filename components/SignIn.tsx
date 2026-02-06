import React, { useState } from 'react';
import { Atom, Eye, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../AppContext';

interface SignInProps {
  onNavigate: (page: 'signup' | 'landing' | 'profile' | 'dashboard') => void;
}

export const SignIn: React.FC<SignInProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request and login
    setTimeout(() => {
      login({
        name: email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        title: 'Research Fellow',
        institution: 'Institute of Advanced Cybernetics'
      });
      setIsLoading(false);
      onNavigate('dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden p-6">
      
      {/* Background Decor */}
      <div className="absolute -bottom-32 -right-32 w-full max-w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Logo */}
      <motion.button 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity"
      >
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
           <Atom className="w-6 h-6 text-emerald-400" />
        </div>
        <span className="font-semibold text-xl tracking-tight text-white">
           Assertion Engine
        </span>
      </motion.button>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card w-full max-w-md p-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-xl font-medium text-slate-200 tracking-wide uppercase mb-2">Researcher Access</h2>
          <p className="text-sm text-slate-500">Validate your credentials to enter the hub.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 ml-1">Academic Email</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@university.edu"
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all pl-10"
              />
              <span className="absolute left-4 top-3.5 text-slate-500">@</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 ml-1">Security Token</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-end">
               <a href="#" className="text-[10px] text-emerald-500 hover:text-emerald-400 font-medium tracking-wide">FORGOT PASSWORD?</a>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                VERIFYING...
              </>
            ) : (
              <>
                SIGN IN <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            New to the validation hub?{' '}
            <button onClick={() => onNavigate('signup')} className="text-white font-medium hover:underline">
              Create an Account
            </button>
          </p>
        </div>
      </motion.div>

      {/* Footer Text */}
      <div className="mt-12 text-[10px] text-slate-600 tracking-widest uppercase font-mono text-center">
        © 2026 Assertion Engine
      </div>
    </div>
  );
};
