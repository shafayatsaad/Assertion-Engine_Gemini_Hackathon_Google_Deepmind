import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'landing' | 'signin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-slate-950 border-t border-white/5 overflow-hidden py-32">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent pointer-events-none" />
      
      {/* Background Watermark */}
      <div className="absolute -left-10 -bottom-24 opacity-[0.015] pointer-events-none select-none">
        <h1 className="text-[14rem] md:text-[20rem] font-bold text-white tracking-tighter leading-none">TRUTH</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-16">
            
            {/* Left Column: Branding & About */}
            <div className="lg:col-span-5 space-y-10">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                        <Atom className="w-7 h-7 text-emerald-400" />
                    </div>
                    <span className="font-bold text-2xl text-white tracking-tight">ASSERTION ENGINE</span>
                </div>
                
                <p className="text-slate-400 text-lg font-light leading-relaxed max-w-lg">
                   Transforming how researchers capture, analyze, and act on scientific intelligence through agentic AI orchestration.
                </p>

                <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-to-r from-white/[0.05] to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
                   <div className="flex items-center gap-2">
                       <Sparkles className="w-4 h-4 text-blue-400 fill-current opacity-90" />
                       <span className="text-sm font-semibold text-white tracking-wide">Gemini Hackathon</span>
                   </div>
                   <div className="h-5 w-px bg-white/20"></div>
                   <div className="flex items-center gap-2">
                       <span className="text-sm font-medium text-slate-300">Google DeepMind</span>
                   </div>
                </div>
            </div>

            {/* Right Columns: Navigation */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:pl-16">
                
                {/* PRODUCT Column */}
                <div className="space-y-7">
                    <h4 className="text-xs font-bold text-white tracking-[0.2em] uppercase opacity-90">Product</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li>
                            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-400 transition-all duration-300 text-left group flex items-center gap-2 w-full hover:translate-x-1">
                                <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                                Demo Flow
                            </button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('modules')} className="hover:text-emerald-400 transition-all duration-300 text-left group flex items-center gap-2 w-full hover:translate-x-1">
                                <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                                Features
                            </button>
                        </li>
                        <li>
                            <button onClick={() => onNavigate('signin')} className="hover:text-emerald-400 transition-all duration-300 text-left group flex items-center gap-2 w-full hover:translate-x-1">
                                <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                                Launch App
                            </button>
                        </li>
                    </ul>
                </div>

                {/* RESOURCES Column */}
                <div className="space-y-7">
                    <h4 className="text-xs font-bold text-white tracking-[0.2em] uppercase opacity-90">Resources</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li>
                            <a href="#" className="hover:text-emerald-400 transition-all duration-300 group flex items-center gap-2 hover:translate-x-1">
                                <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-emerald-400 transition-all duration-300 group flex items-center gap-2 hover:translate-x-1">
                                <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                                Documentation
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-emerald-400 transition-all duration-300 group flex items-center gap-2 hover:translate-x-1">
                                <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                                API Guide
                            </a>
                        </li>
                    </ul>
                </div>

                {/* MISSION Column */}
                <div className="space-y-7">
                    <h4 className="text-xs font-bold text-white tracking-[0.2em] uppercase opacity-90">Mission</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">
                        Built to push the boundaries of multi-agent collaboration and real-time intelligence extraction, serving as a digital wind tunnel for scientific hypotheses.
                    </p>
                </div>

            </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-24 pt-10 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-slate-500 font-mono">
                © 2026 Assertion Engine. All rights reserved.
            </p>
            <div className="flex items-center gap-2.5">
                 <div className="relative">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
                 </div>
                 <span className="text-[10px] font-mono text-emerald-400/90 uppercase tracking-wider font-medium">System Operational</span>
            </div>
        </div>
      </motion.div>
    </footer>
  );
};