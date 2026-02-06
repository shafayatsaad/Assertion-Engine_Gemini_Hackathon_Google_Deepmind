import React, { useState, useEffect } from 'react';
import { Atom, Menu, X, ArrowRight, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext';
import { ProfileDropdown } from './ProfileDropdown';

interface NavbarProps {
  onNavigate: (page: 'landing' | 'signin' | 'signup' | 'dashboard' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useApp();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileNav = (tab: string) => {
    localStorage.setItem('ae_profile_tab', tab);
    onNavigate('profile');
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('landing');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen 
            ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Atom className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-50 transition-colors">
              Assertion
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <div className="flex items-center gap-4">
                <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">Dashboard</button>
                <ProfileDropdown onNavigate={onNavigate} />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate('signin')}
                  className="text-sm font-medium text-white hover:text-emerald-400 transition-colors px-3 py-2"
                >
                  Log in
                </button>
                <button 
                  onClick={() => onNavigate('signup')}
                  className="group bg-emerald-500 text-slate-950 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_-5px_rgba(52,211,153,0.5)] flex items-center gap-2"
                >
                  Start Validating
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-950 pt-24 px-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6 text-lg font-medium text-slate-300">
              {user ? (
                <>
                  <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden">
                       {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div>
                      <div className="text-white text-base">{user.name}</div>
                      <div className="text-slate-500 text-xs">{user.email}</div>
                    </div>
                  </div>
                  
                  <button onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }} className="text-left hover:text-emerald-400">Dashboard</button>
                  <button onClick={() => handleProfileNav('profile')} className="text-left hover:text-emerald-400">Profile</button>
                  <button onClick={() => handleProfileNav('general')} className="text-left hover:text-emerald-400">Settings</button>
                  
                  <button onClick={handleLogout} className="text-left text-rose-400 hover:text-rose-300 flex items-center gap-2">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { onNavigate('signin'); setMobileMenuOpen(false); }} className="text-left">Log in</button>
                  <button onClick={() => { onNavigate('signup'); setMobileMenuOpen(false); }} className="text-emerald-400">Start Validating</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
