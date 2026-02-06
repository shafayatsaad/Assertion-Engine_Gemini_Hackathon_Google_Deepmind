import React, { useState } from 'react';
import { Atom, Shield, FlaskConical, ScanEye, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../AppContext';

interface SignUpProps {
  onNavigate: (page: 'signin' | 'landing' | 'dashboard') => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', field: '' });
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      login({
        name: formData.name,
        email: formData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
        title: 'Lead Researcher',
        institution: 'Independent Labs'
      });
      setIsLoading(false);
      onNavigate('dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col relative overflow-hidden">
      
      {/* Animated Background */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.2, 0.12]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-full max-w-[800px] h-[800px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.18, 0.1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-0 w-full max-w-[700px] h-[700px] bg-emerald-500/12 rounded-full blur-[150px] pointer-events-none"
      />
      
      {/* Simplified Navbar */}
      <nav className="border-b border-white/5 glass-card backdrop-blur-xl px-6 py-4 flex justify-between items-center sticky top-0 z-50">
         <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
            <div className="p-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 group-hover:bg-cyan-400/15 transition-all">
              <Atom className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-bold text-white tracking-tight">Assertion Engine</span>
         </button>
         <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">Already a member?</span>
            <button onClick={() => onNavigate('signin')} className="px-5 py-2.5 border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all font-medium">
                Sign In
            </button>
         </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Column: Info */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6 }}
               className="space-y-8 pt-4"
            >
                <div>
                   <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                     Join the Lab: <br />
                     <span className="text-gradient-animated shimmer inline-block">Start Validating</span>
                   </h1>
                   <p className="text-lg text-slate-400 max-w-md leading-relaxed font-light">
                     The world's first AI-driven validation layer for serious academic research and scientific inquiry.
                   </p>
                </div>

                <div className="space-y-4 mt-8">
                    {/* Feature Card 1 */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="glass-card p-5 rounded-2xl border-l-4 border-l-cyan-400 flex gap-4 items-start hover:border-l-cyan-300 transition-all"
                    >
                        <div className="bg-cyan-400/10 p-2.5 rounded-xl border border-cyan-400/20">
                            <Shield className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">Mentor Validation</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Connecting you with verified academic leads and peer review networks.</p>
                        </div>
                    </motion.div>

                    {/* Feature Card 2 */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="glass-card p-5 rounded-2xl border-l-4 border-l-cyan-400 flex gap-4 items-start hover:border-l-cyan-300 transition-all"
                    >
                        <div className="bg-cyan-400/10 p-2.5 rounded-xl border border-cyan-400/20">
                            <FlaskConical className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">Data Fabrication Detection</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Advanced AI-driven integrity checks for your datasets and results.</p>
                        </div>
                    </motion.div>

                    {/* Feature Card 3 */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="glass-card p-5 rounded-2xl border-l-4 border-l-cyan-400 flex gap-4 items-start hover:border-l-cyan-300 transition-all"
                    >
                         <div className="bg-cyan-400/10 p-2.5 rounded-xl border border-cyan-400/20">
                            <ScanEye className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">Novelty Guard</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Real-time cross-referencing against global scientific literature.</p>
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xs text-slate-600 mt-12"
                >
                   © 2026 Assertion Engine • AI-Powered Validation
                </motion.div>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1, duration: 0.6 }}
               className="glass-card p-10 rounded-3xl border border-white/10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)]"
            >
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                    <p className="text-slate-400 text-sm font-light">Enter your credentials to begin your validation journey</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g., Dr. Jane Smith"
                          className="glass-input w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Institutional Email</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="name@university.edu"
                          className="glass-input w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Research Field</label>
                        <div className="relative">
                            <select 
                                value={formData.field}
                                onChange={(e) => setFormData({...formData, field: e.target.value})}
                                className="glass-input w-full rounded-xl px-4 py-3.5 text-sm text-slate-300 appearance-none cursor-pointer"
                            >
                                <option>Select your specialization</option>
                                <option>Computer Science</option>
                                <option>Biotechnology</option>
                                <option>Quantum Physics</option>
                                <option>Social Sciences</option>
                            </select>
                            <div className="absolute right-4 top-4 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <input 
                          type="password" 
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          placeholder="••••••••"
                          className="glass-input w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500"
                        />
                    </div>

                    <motion.button 
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-[0_0_35px_-5px_rgba(34,211,238,0.5)] hover:shadow-[0_0_45px_-5px_rgba(34,211,238,0.7)] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                          <>
                             <Loader2 className="w-5 h-5 animate-spin" />
                             <span>Processing...</span>
                          </>
                        ) : (
                          <>
                             <span>Begin Research</span>
                             <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                    </motion.button>
                    
                </form>
            </motion.div>
        </div>
      </div>
    </div>
  );
};
