import React from 'react';
import { Network, ScanLine, Swords, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Network,
      title: "Parsing",
      desc: "Mentor AI decomposes your thesis into logical vectors."
    },
    {
      icon: ScanLine,
      title: "Scanning",
      desc: "Specimen Lab stress-tests your data against synthetic outliers."
    },
    {
      icon: Swords,
      title: "Dueling",
      desc: "Novelty engine pits your findings against competing theories."
    },
    {
      icon: FileText,
      title: "Certification",
      desc: "Receive a cryptographic proof of validity and rigor score."
    }
  ];

  return (
    <section id="how-it-works" className="py-32 relative bg-slate-950 border-y border-white/5 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Validation <span className="text-slate-600">Protocol</span>
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
            Our linear validation pipeline processes your work through four rigorous, distinct phases to ensure absolute integrity.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid md:grid-cols-4 gap-12 relative">
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mb-8 relative z-10 group-hover:border-emerald-500/50 group-hover:bg-slate-900/80 transition-all duration-300 shadow-xl">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <step.icon className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    
                    {/* Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-white">
                        0{index + 1}
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                    {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};