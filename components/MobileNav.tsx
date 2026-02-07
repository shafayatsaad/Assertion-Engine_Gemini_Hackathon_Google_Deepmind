import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  LayoutGrid, 
  Database, 
  Library, 
  Activity, 
  Zap, 
  Settings, 
  Home,
  Plus,
  LogOut
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: any) => void;
  currentPage?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate,
  currentPage 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'specimens', label: 'Dataset', icon: Database },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'analysis', label: 'Analysis', icon: Activity },
    { id: 'novelty', label: 'Novelty', icon: Zap },
    { id: 'profile', label: 'Settings', icon: Settings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[280px] bg-slate-900 border-l border-white/10 z-[101] flex flex-col lg:hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <span className="text-sm font-bold text-white tracking-widest uppercase">Menu</span>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                    ${currentPage === item.id 
                      ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${currentPage === item.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    onNavigate('new-project');
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-5 h-5" />
                  New Project
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-slate-950/30">
              <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-rose-400 transition-colors group">
                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-medium">Log Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
