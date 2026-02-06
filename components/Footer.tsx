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
    <footer className="relative bg-slate-950 border-t border-white/5 overflow-hidden py-24">
      {/* Background Watermark */}
      <div className="absolute -left-10 -bottom-20 opacity-[0.02] pointer-events-none select-none">
        <h1 className="text-[12rem] md:text-[18rem] font-bold text-white tracking-tighter leading-none">TRUTH</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
            
            {/* Left Column: Branding & About */}
            <div className="lg:col-span-5 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <Atom className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="font-bold text-2xl text-white tracking-tight">ASSERTION ENGINE</span>
                </div>
                
                <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md">
                   Transforming how researchers capture, analyze, and act on scientific intelligence through agentic AI orchestration.
                </p>

                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                   <div className="flex items-center gap-1.5">
                       <Sparkles className="w-4 h-4 text-blue-400 fill-current opacity-80" />
                       <span className="text-sm font-semibold text-white tracking-wide">Gemini Hackathon</span>
                   </div>
                   <div className="h-4 w-px bg-white/10"></div>
                   <div className="flex items-center gap-1.5">
                       <span className="text-sm font-medium text-slate-300">Google DeepMind</span>
                   </div>
                </div>
            </div>

            {/* Right Columns: Navigation */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:pl-12">
                
                {/* PRODUCT Column */}
                <div className="space-y-6">
                    <h4 className="text-xs font-bold text-white tracking-[0.2em] uppercase">Product</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li>
                            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-400 transition-colors text-left group flex items-center gap-2 w-full">
                                <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300"></span>
                                Demo Flow
                            </button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('modules')} className="hover:text-emerald-400 transition-colors text-left group flex items-center gap-2 w-full">
                                <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300"></span>
                                Features
                            </button>
                        </li>
                        <li>
                            <button onClick={() => onNavigate('signin')} className="hover:text-emerald-400 transition-colors text-left group flex items-center gap-2 w-full">
                                <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300"></span>
                                Launch App
                            </button>
                        </li>
                    </ul>
                </div>

                {/* RESOURCES Column */}
                <div className="space-y-6">
                    <h4 className="text-xs font-bold text-white tracking-[0.2em] uppercase">Resources</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li>
                            <a href="#" className="hover:text-emerald-400 transition-colors group flex items-center gap-2">
                                <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300"></span>
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-emerald-400 transition-colors group flex items-center gap-2">
                                <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300"></span>
                                Documentation
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-emerald-400 transition-colors group flex items-center gap-2">
                                <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300"></span>
                                API Guide
                            </a>
                        </li>
                    </ul>
                </div>

                {/* MISSION Column */}
                <div className="space-y-6">
                    <h4 className="text-xs font-bold text-white tracking-[0.2em] uppercase">Mission</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">
                        Built to push the boundaries of multi-agent collaboration and real-time intelligence extraction, serving as a digital wind tunnel for scientific hypotheses.
                    </p>
                </div>

            </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600 font-mono">
                © 2026 Assertion Engine. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-wider">System Operational</span>
            </div>
        </div>
      </motion.div>
    </footer>
  );
};