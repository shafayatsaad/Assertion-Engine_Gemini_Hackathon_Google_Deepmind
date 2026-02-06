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
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden min-h-[100dvh] flex items-center bg-slate-950">
      {/* LightRays Background */}
      <div className="absolute inset-0 z-0 opacity-35 mix-blend-screen pointer-events-none">
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

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
        
        {/* Left Column: Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 md:space-y-10 text-center lg:text-left"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            <span className="text-white">Stress-Test Your </span><br />
            <span className="text-gradient-animated shimmer inline-block">
              Research
            </span>
            <span className="text-white"> Before </span><br />
            <span className="text-white">You Start.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
          >
            Validate your academic hypotheses with our universal scanner technology before committing resources. Save time, money, and reputation.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-5 pt-4 justify-center lg:justify-start"
          >
            <motion.button 
              onClick={onStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-emerald-500 text-slate-950 px-10 py-5 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 hover:bg-emerald-400 hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.5)] group"
            >
              Start Validating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button 
              onClick={scrollToHowItWorks}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="px-10 py-5 rounded-full font-semibold text-lg text-white border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2 bg-white/[0.02] backdrop-blur-sm"
            >
              How it Works
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-10 pt-8 md:pt-10 border-t border-white/[0.08]"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-slate-300">Peer Reviewed Logic</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-slate-300">Encrypted Data</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Quantum Core Visualization */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center w-full mt-12 lg:mt-0 perspective-[1000px]"
        >
          <div className="relative w-full max-w-[320px] md:max-w-[400px] aspect-square flex items-center justify-center">
            
            {/* Ambient Aurora Background */}
            <div className="absolute inset-0 -z-10">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3], 
                  rotate: [0, 90, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-violet-500/20 blur-[60px] rounded-full mix-blend-screen"
              />
            </div>

            {/* Main Glass Vessel */}
            <motion.div 
              className="relative w-full h-full rounded-full border border-white/10 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center overflow-visible"
              style={{ boxShadow: "0 0 100px -30px rgba(16, 185, 129, 0.2)" }}
            >
              
              {/* Orbital Ring 1 - Outer */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-dashed border-emerald-500/20" 
              />
              
              {/* Orbital Ring 2 - Middle with Ticks */}
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute inset-16 rounded-full border border-white/5"
              >
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-emerald-400/50 rounded-full blur-[1px]" />
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-cyan-400/50 rounded-full blur-[1px]" />
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-1 bg-white/20 rounded-full" />
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-1 bg-white/20 rounded-full" />
              </motion.div>

              {/* Orbital Ring 3 - Inner Fast */}
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-28 rounded-full border-2 border-transparent border-t-cyan-400/40 border-r-emerald-400/40"
              />

              {/* The Core */}
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <motion.div 
                  animate={{ 
                    scale: [1, 0.95, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-slate-950 flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden"
                >
                  {/* Core Gradient */}
                  <motion.div 
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(16,185,129,0.3)_180deg,transparent_360deg)] opacity-50"
                  />
                  
                  {/* Center Text */}
                  <div className="relative z-10 text-center">
                    <motion.div 
                      key="percent"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-emerald-200"
                    >
                      98<span className="text-lg text-emerald-400/80">%</span>
                    </motion.div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/70 font-medium mt-1">Match</div>
                  </div>
                </motion.div>
              </div>

            </motion.div>

            {/* Floating Metric - Top Right */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
              transition={{ 
                opacity: { delay: 0.5 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -top-6 -right-4 md:right-0 glass-card px-5 py-3 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-lg"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Processing</span>
                <span className="text-lg font-semibold text-white font-mono">1.2ms</span>
              </div>
            </motion.div>

             {/* Floating Metric - Bottom Left */}
             <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
              transition={{ 
                opacity: { delay: 0.7 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
              className="absolute -bottom-2 -left-4 md:left-0 glass-card px-5 py-3 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-lg"
            >
               <div className="flex items-center gap-3">
                  <div className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">Active</span>
                    <span className="text-[10px] text-emerald-400/80">System Online</span>
                  </div>
               </div>
            </motion.div>

             {/* Decorative Particle Cloud */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/40 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [0, Math.cos(i * 60) * 140],
                      y: [0, Math.sin(i * 60) * 140],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut"
                    }}
                  />
                ))}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};