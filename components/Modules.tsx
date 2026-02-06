import React from 'react';
import { BrainCircuit, Microscope, ArrowRight, Swords, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Modules: React.FC = () => {
  const modules = [
    {
      title: "Mentor AI",
      icon: Sparkles,
      desc: "Instant feedback from our academic AI core. Scans millions of papers to find contradictions.",
      color: "text-cyan-400",
      gradient: "from-cyan-500/20 to-transparent",
      border: "hover:border-cyan-500/30",
    },
    {
      title: "Specimen Lab",
      icon: Microscope,
      desc: "Test data samples in a controlled environment. Simulate outcomes based on historical datasets.",
      color: "text-emerald-400",
      gradient: "from-emerald-500/20 to-transparent",
      border: "hover:border-emerald-500/30",
    },
    {
      title: "Strategy Duel",
      icon: Swords,
      desc: "Pit your methodology against competing theories in a simulated debate to find weak points.",
      color: "text-amber-400",
      gradient: "from-amber-500/20 to-transparent",
      border: "hover:border-amber-500/30",
    }
  ];

  return (
    <section id="modules" className="py-40 bg-slate-950 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-emerald-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-5"
            >
               <Sparkles className="w-3.5 h-3.5 animate-pulse" />
               Core Modules
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
               <span className="text-white">Research </span>
               <span className="text-gradient-animated shimmer inline-block">Pipeline</span>
            </h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-400 text-lg font-light leading-relaxed"
            >
              Choose your validation pathway. Each module is designed to rigorously test a specific aspect of your thesis before peer review.
            </motion.p>
          </motion.div>
          
          <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="hidden md:flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition-all"
          >
             View Documentation <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {modules.map((mod, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 60, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 80,
                damping: 20
              }}
              whileHover={{ 
                y: -12,
                scale: 1.02,
                transition: { duration: 0.3, type: "spring", stiffness: 400 }
              }}
              className={`group relative p-10 rounded-[2rem] bg-slate-900/60 border border-white/[0.08] backdrop-blur-sm transition-all duration-500 hover:bg-slate-900/90 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ${mod.border}`}
              style={{ perspective: "1000px" }}
            >
              {/* Gradient glow effect */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} rounded-[2rem]`} 
              />
              
              <div className="relative z-10">
                  <motion.div 
                    whileHover={{ 
                      scale: 1.15, 
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.5 }
                    }}
                    className={`w-16 h-16 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center mb-10 shadow-xl group-hover:shadow-2xl transition-shadow duration-500 relative overflow-hidden`}
                  >
                    {/* Animated background glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-[glow-pulse_2s_ease-in-out_infinite]`} />
                    <mod.icon className={`w-7 h-7 ${mod.color} relative z-10 group-hover:scale-110 transition-transform duration-300 ${mod.title === 'Mentor AI' ? 'animate-pulse' : ''}`} />
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                    className="text-2xl font-bold text-white mb-5"
                  >
                    {mod.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.4 }}
                    className="text-slate-400 text-base leading-relaxed"
                  >
                    {mod.desc}
                  </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};