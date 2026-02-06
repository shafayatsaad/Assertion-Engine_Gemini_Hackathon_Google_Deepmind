import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Lock, BarChart3, Check, ChevronRight } from 'lucide-react';
import LightRays from './LightRays';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden min-h-[100dvh] flex items-center bg-slate-950">
      {/* LightRays Background */}
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none">
          <LightRays
            raysOrigin="top-center"
            raysColor="#10b981"
            raysSpeed={0.2}
            lightSpread={0.6}
            rayLength={5}
            followMouse={true}
            mouseInfluence={0.2}
            noiseAmount={0.05}
            distortion={0.2}
          />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Column: Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 md:space-y-8 text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Stress-Test Your <br />
            <span className="text-gradient-emerald">
              Research
            </span> Before <br />
            You Start.
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            Validate your academic hypotheses with our universal scanner technology before committing resources. Save time, money, and reputation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
            <button 
              onClick={onStart}
              className="bg-emerald-500 text-slate-950 px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 hover:bg-emerald-400 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] group"
            >
              Start Validating
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={scrollToHowItWorks}
              className="px-8 py-4 rounded-full font-medium text-white border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2 bg-white/[0.02] backdrop-blur-sm"
            >
              How it Works
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 pt-6 md:pt-8 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm text-slate-300">Peer Reviewed Logic</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm text-slate-300">Encrypted Data</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: HUD / Scanner Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center w-full perspective-[2000px] mt-8 lg:mt-0"
        >
            {/* Main Card Container with 3D effect */}
           <div className="relative w-full max-w-sm md:max-w-md aspect-square bg-slate-900/40 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl group hover:border-white/20 transition-colors duration-500">
                
                {/* Internal Grid/Tech Background */}
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/80" />
                
                {/* Central Scanner Core */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-64 h-64 scale-[0.8] md:scale-100">
                        {/* Cyan Brackets Frame */}
                        <div className="absolute inset-0 border border-emerald-500/10 rounded-full animate-pulse" />
                        
                        {/* Rotating Rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                             {/* Outer Ring */}
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="w-56 h-56 rounded-full border border-dashed border-white/10"
                            />
                             {/* Middle Ring */}
                            <motion.div 
                                animate={{ rotate: -360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute w-44 h-44 rounded-full border border-white/20 border-t-emerald-400/50"
                            />
                            {/* Core Glow */}
                            <div className="absolute w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl" />
                            <div className="absolute w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl mix-blend-screen" />
                            
                            {/* Center UI */}
                            <div className="relative z-10 text-center">
                                <div className="text-4xl font-bold text-white tracking-tighter">98<span className="text-lg text-emerald-400">%</span></div>
                                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">Confidence</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Status Panel */}
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                    <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-medium text-slate-300">Analysis Active</span>
                            </div>
                            <span className="text-xs font-mono text-slate-500">00:12:42</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: "87%" }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-8 right-8 md:top-12 md:right-12"
                >
                    <div className="glass-card p-3 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Check className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white">Verified</div>
                            <div className="text-[10px] text-slate-400">Logic consistent</div>
                        </div>
                    </div>
                </motion.div>

           </div>
        </motion.div>
      </div>
    </section>
  );
};