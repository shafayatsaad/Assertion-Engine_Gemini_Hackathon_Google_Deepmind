import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Modules } from './components/Modules';
import { Footer } from './components/Footer';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { ProfileDashboard } from './components/ProfileDashboard';
import { Dashboard } from './components/Dashboard';
import { NewProjectWizard } from './components/NewProjectWizard';
import { ResearchLibrary } from './components/ResearchLibrary';
import { SpecimenLab } from './components/SpecimenLab';
import { AnalysisPage } from './components/AnalysisPage';
import { NoveltyPage } from './components/NoveltyPage';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './AppContext';

// Modern CTA Section
interface CTASectionProps {
  onStart: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStart }) => {
  return (
    <section className="py-40 px-6 relative overflow-hidden">
      {/* Animated Background Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.18, 0.12]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.12] rounded-full blur-[120px] pointer-events-none" 
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-[2.5rem] p-16 md:p-24 text-center relative overflow-hidden border border-white/[0.12] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all duration-500"
        >
          
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold mb-8 tracking-tight"
            >
              <span className="text-white">Ready to secure your </span><br/>
              <span className="text-gradient-animated shimmer inline-block">academic legacy?</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-slate-400 mb-12 max-w-xl font-light leading-relaxed"
            >
              Join elite research institutions using Assertion Engine to validate, secure, and accelerate their discovery pipelines.
            </motion.p>
            
            <motion.button 
              onClick={onStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(16,185,129,0.3)",
                  "0 0 40px rgba(16,185,129,0.5)",
                  "0 0 20px rgba(16,185,129,0.3)"
                ]
              }}
              transition={{ 
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="bg-emerald-500 text-slate-950 px-12 py-6 rounded-full font-bold text-lg transition-all flex items-center gap-3 group relative overflow-hidden"
            >
              <span className="relative z-10">Get Started Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </motion.button>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xs text-slate-500 mt-10 font-mono tracking-wide"
            >
              AI-Powered Validation • Real-Time Analysis • Academic Research
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={`min-h-screen ${className}`}
  >
    {children}
  </motion.div>
);

const MainApp = () => {
  const [view, setView] = useState<'landing' | 'signin' | 'signup' | 'profile' | 'dashboard' | 'new-project' | 'library' | 'specimen-lab' | 'analysis' | 'novelty'>('landing');
  const { user } = useApp();

  // Redirect to dashboard if logged in and on landing/auth pages
  useEffect(() => {
    if (user && (view === 'landing' || view === 'signin' || view === 'signup')) {
      setView('dashboard');
    }
  }, [user, view]);

  return (
    <div className="bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <AnimatePresence mode="wait">
        
        {view === 'landing' && (
          <PageTransition key="landing">
             <Navbar onNavigate={setView} />
             <main>
               <Hero onStart={() => setView('signup')} />
               <HowItWorks />
               <Modules />
               <CTASection onStart={() => setView('signup')} />
             </main>
             <Footer onNavigate={setView} />
          </PageTransition>
        )}

        {view === 'signin' && (
          <PageTransition key="signin">
            <SignIn onNavigate={setView} />
          </PageTransition>
        )}

        {view === 'signup' && (
          <PageTransition key="signup">
            <SignUp onNavigate={setView} />
          </PageTransition>
        )}

        {view === 'profile' && (
          <PageTransition key="profile">
            <ProfileDashboard onNavigate={setView} />
          </PageTransition>
        )}

        {view === 'dashboard' && (
          <PageTransition key="dashboard">
            <Dashboard onNavigate={setView} />
          </PageTransition>
        )}

        {view === 'new-project' && (
          <PageTransition key="new-project">
            <NewProjectWizard onNavigate={setView} />
          </PageTransition>
        )}

        {view === 'library' && (
          <PageTransition key="library">
            <ResearchLibrary onNavigate={setView} />
          </PageTransition>
        )}

        {view === 'specimen-lab' && (
          <PageTransition key="specimen-lab">
            <SpecimenLab onNavigate={setView} />
          </PageTransition>
        )}

        {view === 'analysis' && (
          <PageTransition key="analysis">
            <AnalysisPage onNavigate={setView} />
          </PageTransition>
        )}

        {view === 'novelty' && (
          <PageTransition key="novelty">
            <NoveltyPage onNavigate={setView} />
          </PageTransition>
        )}

      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  )
}
