import React, { useState } from 'react';
import { 
  Atom, 
  Plus, 
  Play, 
  Share2, 
  MoreHorizontal, 
  Clock, 
  Activity, 
  ArrowRight,
  CheckCircle2, 
  Beaker,
  BrainCircuit,
  Swords,
  X,
  Copy,
  Linkedin,
  Twitter,
  Facebook,
  Link,
  FileText,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext';
import { ProfileDropdown } from './ProfileDropdown';

interface DashboardProps {
  onNavigate: (page: 'landing' | 'profile' | 'settings' | 'dashboard' | 'newproject' | 'library' | 'analysis') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  
  const { user, logs, projects, getActiveProject, setActiveProject, deleteProject, clearLogs, activeProjectId } = useApp();
  
  const activeProject = getActiveProject();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* App Navigation Bar */}
      <nav className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
               <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Atom className="w-4 h-4 text-emerald-500" />
               </div>
               <span className="font-semibold text-white tracking-tight hidden sm:inline">Dashboard</span>
            </button>
            
            <div className="hidden md:flex items-center gap-1">
              <NavLink label="Dashboard" active />
              <button onClick={() => onNavigate('library')} className="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-white/5">
                Library
              </button>
              <button onClick={() => onNavigate('specimens')} className="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-white/5">
                Dataset
              </button>
              <button onClick={() => onNavigate('settings')} className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                Settings
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => onNavigate('newproject')}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold transition-all shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
            </button>
            <ProfileDropdown onNavigate={onNavigate} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        
        {/* Breadcrumb & Header */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">Project Overview</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* ... rest of the component remains unchanged ... */}
            
            {/* Left Column: Main Project Card & Metrics */}
            <div className="lg:col-span-2 space-y-8">
                
                {activeProject ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                        className="relative overflow-hidden rounded-3xl bg-slate-900 border border-white/10 min-h-[300px] flex flex-col justify-between group"
                    >
                        {/* Background Visuals */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute right-0 bottom-0 w-full h-full bg-gradient-to-l from-slate-900 via-transparent to-transparent opacity-80" />

                        {/* Content */}
                        <div className="relative z-10 p-6 md:p-8">
                            <div className="inline-flex items-center gap-2 px-2 py-1 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono uppercase tracking-wide mb-4">
                                Active Mission
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{activeProject.title}</h2>
                            <p className="text-slate-400 max-w-lg leading-relaxed text-sm line-clamp-3">
                               {activeProject.hypothesis}
                            </p>
                        </div>

                        {/* Actions Bar */}
                        <div className="relative z-10 p-6 border-t border-white/5 bg-slate-950/30 backdrop-blur-sm flex items-center justify-end gap-3">
                            <button 
                                onClick={() => setIsShareOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 text-sm font-medium transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                            <button 
                                onClick={() => { setActiveProject(activeProject.id); onNavigate('analysis'); }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg btn-primary text-sm"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                Resume Research
                            </button>
                            <button 
                                onClick={async () => {
                                    if(confirm("Are you sure you want to delete this project?")) {
                                        await deleteProject(activeProject.id);
                                    }
                                }}
                                className="p-2 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-500 transition-colors"
                                title="Delete Project"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="rounded-3xl bg-slate-900/50 border border-white/10 min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
                        <h2 className="text-xl font-bold text-white mb-2">No Active Projects</h2>
                        <p className="text-slate-400 mb-6">Start a new validation mission to see analytics.</p>
                        <button onClick={() => onNavigate('newproject')} className="bg-emerald-500 text-slate-950 px-6 py-3 rounded-lg font-bold hover:bg-emerald-400 transition-colors">Create Project</button>
                    </div>
                )}

                {/* Metrics Grid */}
                {activeProject && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetricCard 
                            label="Confidence Score" 
                            value={activeProject.metrics.confidence > 0 ? `${activeProject.metrics.confidence}%` : "---"} 
                            subValue={activeProject.metrics.confidence > 0 ? "Calculated" : "Pending"} 
                            color="text-emerald-400"
                            accentColor="bg-emerald-500"
                            delay={0.1}
                        />
                        <MetricCard 
                            label="Data Samples" 
                            value={activeProject.metrics.samples > 0 ? activeProject.metrics.samples.toLocaleString() : "---"} 
                            subValue={activeProject.metrics.samples > 0 ? "Verified" : "No Data"} 
                            color="text-cyan-400"
                            accentColor="bg-cyan-500"
                            delay={0.2}
                        />
                        <MetricCard 
                            label="Compute Time" 
                            value={activeProject.metrics.computeTime || "0h 0m"} 
                            icon={Clock}
                            color="text-white"
                            accentColor="bg-purple-500"
                            delay={0.3}
                        />
                    </div>
                )}
            </div>

            {/* Right Column: Lab Status */}
            {activeProject ? (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-card rounded-3xl p-6 border border-white/10 bg-slate-900/50 flex flex-col h-full"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-white">3-Room Lab Status</h3>
                        <button className="text-slate-500 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
                    </div>

                    <div className="space-y-8 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-800" />

                        {/* Step 1: Mentor */}
                        <StatusItem 
                            icon={BrainCircuit}
                            title="Mentor Validation"
                            status="Active"
                            desc="Hypothesis analysis initialized"
                            state="active"
                            progress={activeProject.analysisChat && activeProject.analysisChat.length > 2 ? 80 : 30}
                        />

                        {/* Step 2: Specimen */}
                        <StatusItem 
                            icon={Beaker}
                            title="Specimen Analysis"
                            status={activeProject.specimens.length > 0 ? "Processing" : "Pending"}
                            desc={activeProject.specimens.length > 0 ? `${activeProject.specimens.length} samples queued` : "Awaiting upload"}
                            state={activeProject.specimens.length > 0 ? "active" : "pending"}
                            progress={activeProject.specimens.length > 0 ? 60 : 0}
                        />

                        {/* Step 3: Strategy */}
                        <StatusItem 
                            icon={Swords}
                            title="Strategy Synthesis"
                            status={activeProject.noveltyPapers.length > 0 ? "Review" : "Pending"}
                            desc={activeProject.noveltyPapers.length > 0 ? `${activeProject.noveltyPapers.length} papers dueling` : "Awaiting scan"}
                            state={activeProject.noveltyPapers.length > 0 ? "completed" : "pending"}
                        />
                    </div>

                    <button 
                        onClick={() => setIsLogsOpen(true)}
                        className="mt-auto pt-6 flex items-center justify-between text-sm text-slate-400 hover:text-white group transition-colors"
                    >
                        View detailed log
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            ) : (
                <div className="glass-card rounded-3xl p-6 border border-white/10 bg-slate-900/50 flex flex-col items-center justify-center text-center text-slate-500">
                    <Activity className="w-12 h-12 mb-4 opacity-50" />
                    <p>Select or create a project to view lab status.</p>
                </div>
            )}
        </div>

        {/* Recent Executions Table */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl border border-white/5 bg-slate-900/30 overflow-hidden"
        >
            <div className="p-6 border-b border-white/5">
                <h3 className="font-bold text-white">Recent Executions</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead>
                        <tr className="bg-white/[0.02] text-xs font-mono text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Project</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Updated</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {projects.length > 0 ? projects.slice(0, 5).map(p => (
                             <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => { setActiveProject(p.id); onNavigate('analysis'); }}>
                                <td className="px-6 py-4 font-mono text-emerald-500 group-hover:underline">#{p.id}</td>
                                <td className="px-6 py-4 text-white truncate max-w-[200px]">{p.title}</td>
                                <td className="px-6 py-4">
                                    <Badge 
                                        status={activeProjectId !== p.id && p.status === 'ANALYZING' ? 'warning' : p.status === 'COMPLETED' ? 'success' : p.status === 'FAILED' ? 'error' : 'warning'} 
                                        label={activeProjectId !== p.id && p.status === 'ANALYZING' ? 'PAUSED' : p.status} 
                                    />
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-right font-mono">{new Date(p.updated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No executions yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>

      </main>

      {/* Modals */}
      <AnimatePresence>
        {isShareOpen && <ShareModal onClose={() => setIsShareOpen(false)} />}
        {isLogsOpen && <LogsModal onClose={() => setIsLogsOpen(false)} logs={logs} clearLogs={clearLogs} />}
      </AnimatePresence>

    </div>
  );
};

// --- Sub-components ---

const NavLink = ({ label, active }: { label: string, active?: boolean }) => (
    <button className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${active ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        {label}
    </button>
);

const MetricCard = ({ label, value, subValue, icon: Icon, color, accentColor, delay = 0 }: any) => (
    <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.4, delay }}
        className="glass-card p-6 rounded-2xl bg-slate-900/50 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors"
    >
        <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${accentColor}`} />
        <div className="pl-3">
             <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-2 group-hover:text-slate-400 transition-colors">{label}</div>
             <div className="flex items-baseline gap-2 flex-wrap">
                 <span className={`text-3xl font-bold font-mono ${color}`}>{value}</span>
                 {subValue && <span className="text-xs font-mono text-slate-500">{subValue}</span>}
                 {Icon && <Icon className="w-5 h-5 text-slate-500" />}
             </div>
        </div>
    </motion.div>
);

const StatusItem = ({ icon: Icon, title, status, desc, state, progress }: any) => {
    const isCompleted = state === 'completed';
    const isActive = state === 'active';
    const isPending = state === 'pending';

    return (
        <div className={`relative flex gap-4 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            <div className={`
                relative z-10 w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-all
                ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : ''}
                ${isActive ? 'bg-slate-800 border-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''}
                ${isPending ? 'bg-slate-900 border-white/5 text-slate-600' : ''}
            `}>
                <Icon className="w-5 h-5" />
                {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-950 rounded-full flex items-center justify-center">
                         <div className="w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-2 h-2 text-slate-950" />
                         </div>
                    </div>
                )}
            </div>
            
            <div className="flex-1 pt-1">
                <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>{title}</h4>
                    <span className={`text-[10px] font-mono uppercase ${
                        isCompleted ? 'text-emerald-500' : isActive ? 'text-white' : 'text-slate-600'
                    }`}>
                        {status}
                    </span>
                </div>
                <p className="text-xs text-slate-500 leading-snug mb-2">{desc}</p>
                
                {isActive && progress && (
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-emerald-500"
                        />
                    </div>
                )}
                {isCompleted && (
                    <div className="h-0.5 w-16 bg-emerald-500/50 rounded-full mt-2" />
                )}
            </div>
        </div>
    );
};

const Badge = ({ status, label }: { status: 'success' | 'warning' | 'error', label: string }) => {
    const styles = {
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        error: "bg-rose-500/10 text-rose-400 border-rose-500/20"
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${styles[status]}`}>
            {label}
        </span>
    );
};

// --- Modal Components ---

const ShareModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm relative shadow-2xl"
        >
            <button onClick={onClose} className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-2">Share Project</h3>
            <p className="text-sm text-slate-400 mb-6">Invite collaborators or share your findings.</p>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
                <SocialButton icon={Twitter} label="Twitter" color="hover:text-sky-400 hover:bg-sky-500/10" />
                <SocialButton icon={Linkedin} label="LinkedIn" color="hover:text-blue-500 hover:bg-blue-500/10" />
                <SocialButton icon={Facebook} label="Facebook" color="hover:text-indigo-500 hover:bg-indigo-500/10" />
                <SocialButton icon={Link} label="Copy" color="hover:text-emerald-400 hover:bg-emerald-500/10" />
            </div>

            <div className="relative">
                <input 
                    type="text" 
                    readOnly 
                    value="https://assertion.engine/p/alpha-9" 
                    className="w-full bg-slate-950 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-sm text-slate-300 focus:outline-none"
                />
                <button className="absolute right-2 top-2 p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    </div>
);

const LogsModal = ({ onClose, logs, clearLogs }: any) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
        >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg border border-white/5">
                        <FileText className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">System Logs</h3>
                        <p className="text-xs text-slate-500 font-mono">Real-time Feed</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => { if(confirm("Clear all logs?")) clearLogs(); }}
                        className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-wider px-2 py-1 rounded hover:bg-rose-500/10"
                    >
                        Clear History
                    </button>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-900 z-10">
                        <tr className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                            <th className="p-4">Time</th>
                            <th className="p-4">Module</th>
                            <th className="p-4">Event</th>
                            <th className="p-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm font-mono">
                        {logs.map((log: any) => (
                            <tr key={log.id} className="hover:bg-white/[0.02]">
                                <td className="p-4 text-slate-500">{log.time}</td>
                                <td className="p-4 text-slate-300">{log.module}</td>
                                <td className="p-4 text-slate-300">{log.event}</td>
                                <td className="p-4 text-right">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold
                                        ${log.status === 'success' ? 'text-emerald-400 bg-emerald-500/10' : ''}
                                        ${log.status === 'warning' ? 'text-amber-400 bg-amber-500/10' : ''}
                                        ${log.status === 'info' ? 'text-cyan-400 bg-cyan-500/10' : ''}
                                        ${log.status === 'error' ? 'text-rose-400 bg-rose-500/10' : ''}
                                    `}>
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-4 border-t border-white/5 bg-slate-950/30 rounded-b-2xl flex justify-end">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Download Full Log
                </button>
            </div>
        </motion.div>
    </div>
);

const SocialButton = ({ icon: Icon, label, color }: any) => (
    <button className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-950 border border-white/5 transition-all group ${color}`}>
        <Icon className="w-6 h-6 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-[10px] font-medium text-slate-500 group-hover:text-white">{label}</span>
    </button>
);
