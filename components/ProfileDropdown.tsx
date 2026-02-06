import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Key, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext';

interface ProfileDropdownProps {
  onNavigate: (page: any) => void;
  className?: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onNavigate, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useApp();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (tab: string) => {
    localStorage.setItem('ae_profile_tab', tab);
    onNavigate('profile');
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('landing');
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all ${isOpen ? 'bg-slate-800 border-emerald-500/50' : 'bg-slate-800/50 border-white/10 hover:border-white/20'}`}
      >
        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center">
            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="User" /> : <User className="w-4 h-4 text-slate-400" />}
        </div>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 glass-card rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50 flex flex-col bg-slate-900"
          >
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            
            <div className="p-2 space-y-1">
              <MenuLink icon={User} label="Profile" onClick={() => handleNav('profile')} />
              <MenuLink icon={Settings} label="General" onClick={() => handleNav('general')} />
              <MenuLink icon={Key} label="API Keys" onClick={() => handleNav('apikeys')} />
            </div>

            <div className="p-2 border-t border-white/5 bg-white/[0.02]">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuLink = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
  >
    <Icon className="w-4 h-4 text-slate-400" />
    {label}
  </button>
);
