import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  FileText, 
  LayoutGrid, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Atom,
  Settings,
  Bell,
  Plus,
  MoreHorizontal,
  Loader2,
  Database,
  ScanLine,
  ChevronRight,
  User,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../AppContext';
import { ProfileDropdown } from './ProfileDropdown';
import { MobileNav } from './MobileNav';
import { Menu } from 'lucide-react';

interface ResearchLibraryProps {
  onNavigate: (page: 'dashboard' | 'library' | 'new-project' | 'profile' | 'analysis') => void;
}

export const ResearchLibrary: React.FC<ResearchLibraryProps> = ({ onNavigate }) => {
  const { projects, setActiveProject, deleteProject, user, activeProjectId } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
               <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Atom className="w-4 h-4 text-emerald-500" />
               </div>
               <span className="font-semibold text-white tracking-tight hidden sm:inline">Library</span>
            </button>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
              <button className="text-white">Library</button>
              <button onClick={() => onNavigate('specimens')} className="hover:text-white transition-colors">Dataset</button>
              <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">Settings</button>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => onNavigate('new-project')}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs md:text-sm font-bold rounded-lg transition-all shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]"
            >
              New Project
            </button>
            <button 
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <ProfileDropdown onNavigate={onNavigate} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-slate-500 mb-6">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
            <button onClick={() => onNavigate('new-project')} className="hover:text-white transition-colors">Project</button>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
            <button onClick={() => onNavigate('analysis')} className="hover:text-white transition-colors">Analysis</button>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
            <span className="text-emerald-400">Library</span>
        </nav>

        {/* Header */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">Research Library</h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Access and validate your archived laboratory records, quantum analysis reports, and neural network findings.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-colors">
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative group"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 md:pr-20 py-4 bg-slate-900/50 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm font-mono"
            placeholder="Search Laboratory Records ..."
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none hidden md:flex">
            <kbd className="px-2 py-1 text-[10px] font-mono font-medium text-slate-500 bg-slate-800 rounded border border-slate-700">
              CMD + K
            </kbd>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {projects.length > 0 ? projects.map((project, index) => (
             <ProjectCard 
                key={project.id}
                id={project.id}
                title={project.title}
                progress={project.progress || 0}
                updated={new Date(project.updated).toLocaleDateString()}
                status={activeProjectId === project.id ? (project.status === 'ANALYZING' ? 'RUNNING' : project.status) : (project.status === 'ANALYZING' ? 'PAUSED' : project.status)}
                statusColor={
                    activeProjectId === project.id 
                    ? (project.status === 'ANALYZING' ? 'emerald' : 'blue') 
                    : (project.status === 'ANALYZING' ? 'amber' : project.status === 'FAILED' ? 'rose' : 'blue')
                }
                onClick={() => { setActiveProject(project.id); onNavigate('analysis'); }}
                steps={[
                  { label: "PDF Parsed", state: "done", icon: FileText },
                  { label: "Analysis", state: project.status === 'COMPLETED' ? 'done' : 'loading', icon: ScanLine },
                  { label: "Verified", state: project.status === 'COMPLETED' ? 'done' : 'pending', icon: CheckCircle2 }
                ]}
                index={index}
                onDelete={async (e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (confirm("Permanently delete this project?")) {
                    await deleteProject(project.id);
                  }
                }}
             />
          )) : (
            <div className="col-span-full text-center py-20 text-slate-500">
                No projects found. Create your first research validation.
            </div>
          )}

        </div>
      </main>

      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
        onNavigate={onNavigate}
        currentPage="library"
      />
    </div>
  );
};

const ProjectCard = ({ id, title, status, progress, updated, statusColor, steps, onClick, onDelete, index = 0 }: any) => {
  const colors: any = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    blue: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  };

  const theme = colors[statusColor] || colors.blue;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="glass-card bg-slate-900/40 border border-white/5 rounded-2xl p-6 relative group overflow-hidden cursor-pointer hover:border-white/20 hover:bg-white/[0.03] transition-all"
    >
      {/* Top Row */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${theme.bg} ${theme.text} border ${theme.border}`}>
            {status}
          </span>
          <span className="text-xs font-mono text-slate-500">#{id}</span>
        </div>
        
        <button 
          onClick={onDelete}
          className="p-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </button>
        
        {/* Progress Circle */}
        <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={theme.text}
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
            <span className="absolute text-[9px] font-bold text-white">{progress}%</span>
        </div>
      </div>

      {/* Main Info */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors truncate">{title}</h3>
        <p className="text-xs text-slate-500">Updated {updated}</p>
      </div>

      {/* Bottom Steps */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/50 rounded-xl p-3 border border-white/5">
        {steps.map((step: any, i: number) => {
            let iconColor = "text-slate-600";
            let textColor = "text-slate-600";
            
            if (step.state === 'done') { iconColor = "text-emerald-400"; textColor = "text-slate-400"; }
            if (step.state === 'loading') { iconColor = "text-cyan-400 animate-spin"; textColor = "text-cyan-400"; }
            if (step.state === 'warning') { iconColor = "text-amber-400"; textColor = "text-amber-400"; }
            if (step.state === 'error') { iconColor = "text-rose-400"; textColor = "text-rose-400"; }
            if (step.state === 'pending') { iconColor = "text-slate-600"; textColor = "text-slate-600"; }


            return (
                <div key={i} className="flex flex-col items-center justify-center text-center gap-1.5">
                    <step.icon className={`w-4 h-4 ${iconColor}`} />
                    <span className={`text-[9px] font-medium ${textColor}`}>{step.label}</span>
                </div>
            )
        })}
      </div>
    </motion.div>
  );
}
