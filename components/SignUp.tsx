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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col">
      
      {/* Simplified Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
         <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 hover:opacity-80">
            <Atom className="w-5 h-5 text-cyan-400" />
            <span className="font-semibold text-white tracking-tight">Assertion Engine</span>
         </button>
         <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500">Already a member?</span>
            <button onClick={() => onNavigate('signin')} className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                Sign In
            </button>
         </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Column: Info */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-8 pt-4"
            >
                <div>
                   <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                     Sign Up: <br />
                     <span className="text-cyan-400">Join the Lab</span>
                   </h1>
                   <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                     The world's first AI-driven validation layer for serious academic research and scientific inquiry.
                   </p>
                </div>

                <div className="space-y-4 mt-8">
                    {/* Feature Card 1 */}
                    <div className="glass-card p-5 rounded-xl border-l-4 border-l-cyan-400 flex gap-4 items-start">
                        <div className="bg-cyan-400/10 p-2.5 rounded-lg">
                            <Shield className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Mentor Validation</h3>
                            <p className="text-sm text-slate-400 mt-1">Connecting you with verified academic leads and peer review networks.</p>
                        </div>
                    </div>

                    {/* Feature Card 2 */}
                    <div className="glass-card p-5 rounded-xl border-l-4 border-l-cyan-400 flex gap-4 items-start">
                        <div className="bg-cyan-400/10 p-2.5 rounded-lg">
                            <FlaskConical className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Data Fabrication Detection</h3>
                            <p className="text-sm text-slate-400 mt-1">Advanced AI-driven integrity checks for your datasets and results.</p>
                        </div>
                    </div>

                    {/* Feature Card 3 */}
                    <div className="glass-card p-5 rounded-xl border-l-4 border-l-cyan-400 flex gap-4 items-start">
                         <div className="bg-cyan-400/10 p-2.5 rounded-lg">
                            <ScanEye className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Novelty Guard</h3>
                            <p className="text-sm text-slate-400 mt-1">Real-time cross-referencing against global scientific literature.</p>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-slate-600 mt-12">
                   © 2026 Assertion Engine. For Institutional Use Only.
                </div>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="glass-card p-8 rounded-2xl border border-white/10 bg-slate-900/50"
            >
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Researcher Profile</h2>
                    <p className="text-slate-400 text-sm">Enter your credentials to begin your validation journey.</p>
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
                          className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
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
                          className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Research Field</label>
                        <div className="relative">
                            <select 
                                value={formData.field}
                                onChange={(e) => setFormData({...formData, field: e.target.value})}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 appearance-none cursor-pointer"
                            >
                                <option>Select your specialization</option>
                                <option>Computer Science</option>
                                <option>Biotechnology</option>
                                <option>Quantum Physics</option>
                                <option>Social Sciences</option>
                            </select>
                            <div className="absolute right-4 top-4 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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
                          className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_0_25px_-5px_rgba(34,211,238,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                          <>
                             <Loader2 className="w-5 h-5 animate-spin" />
                             Processing Credentials...
                          </>
                        ) : (
                          <>
                             Begin Research <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                    </button>
                    
                </form>
            </motion.div>
        </div>
      </div>
    </div>
  );
};
