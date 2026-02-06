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
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden p-6">
      
      {/* Animated Background */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -right-32 w-full max-w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -top-32 -left-32 w-full max-w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Header Logo */}
      <motion.button 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity group"
      >
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/15 transition-all">
           <Atom className="w-6 h-6 text-emerald-400" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">
           Assertion Engine
        </span>
      </motion.button>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="glass-card w-full max-w-md p-10 rounded-3xl border border-white/10 relative z-10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-3 tracking-tight"
          >
            Welcome Back
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-slate-400 font-light"
          >
            Sign in to access your research validation hub
          </motion.p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email"
                className="glass-input w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 pl-10"
              />
              <span className="absolute left-4 top-3.5 text-slate-400">@</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="glass-input w-full rounded-xl pl-10 pr-10 py-3.5 text-sm text-white placeholder-slate-500"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-rose-400 mt-2"
              >
                {error}
              </motion.p>
            )}
            <div className="flex justify-end">
               <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Forgot password?</a>
            </div>
          </motion.div>

          <motion.button 
            type="submit"
            disabled={isLoading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-400">
            New to the validation hub?{' '}
            <button onClick={() => onNavigate('signup')} className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
              Create an Account
            </button>
          </p>
        </motion.div>
      </motion.div>

      {/* Footer Text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-xs text-slate-600 tracking-wider font-mono text-center"
      >
        © 2026 Assertion Engine • AI-Powered Validation
      </motion.div>
    </div>
  );
};
