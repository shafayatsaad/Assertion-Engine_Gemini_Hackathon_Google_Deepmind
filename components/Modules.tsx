import React from 'react';
import { BrainCircuit, Microscope, ArrowRight, Swords, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Modules: React.FC = () => {
  const modules = [
    {
      title: "Mentor AI",
      icon: BrainCircuit,
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
    <section id="modules" className="py-32 bg-slate-950 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs uppercase tracking-widest mb-4">
               <Sparkles className="w-3 h-3" />
               Core Modules
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
               Research <span className="text-slate-500">Pipeline</span>
            </h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              Choose your validation pathway. Each module is designed to rigorously test a specific aspect of your thesis before peer review.
            </p>
          </motion.div>
          
          <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
             View Documentation <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {modules.map((mod, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-10%" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`group relative p-8 rounded-[2rem] bg-slate-900/50 border border-white/5 backdrop-blur-sm transition-all duration-500 hover:bg-slate-900/80 ${mod.border}`}
            >
              {/* Gradient glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]`} />
              
              <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <mod.icon className={`w-6 h-6 ${mod.color}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{mod.title}</h3>
                  <p className="text-slate-400 text-base leading-relaxed mb-8">
                    {mod.desc}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm font-medium text-white opacity-60 group-hover:opacity-100 transition-opacity">
                    <span>Initialize</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};