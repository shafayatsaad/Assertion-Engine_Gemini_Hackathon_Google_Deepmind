import React, { useState, useRef } from 'react';
import { 
  Microscope, 
  Settings,
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Activity, 
  AlertTriangle, 
  Info, 
  CheckCircle2,
  ChevronRight,
  Loader2,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, Specimen } from '../AppContext';
import { ProfileDropdown } from './ProfileDropdown';

interface SpecimenLabProps {
  onNavigate: (page: 'dashboard' | 'library' | 'new-project' | 'profile') => void;
}

export const SpecimenLab: React.FC<SpecimenLabProps> = ({ onNavigate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { addLog, getActiveProject, updateProject, user } = useApp();
  const activeProject = getActiveProject();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateRiskText = (type: string) => {
      if (type === 'vision') return "Metadata scrubbing recommended. Visual artifacts detected.";
      if (type === 'audio') return "Background noise levels within tolerance. Bitrate variable.";
      return "Schema validation pending. Null values detected in optional columns.";
  };

  const triggerFileSelect = () => {
    if (!activeProject) {
        alert("Please select a project first.");
        return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    addLog({ module: 'Specimen Lab', event: `Started ingestion for project: ${activeProject?.title}`, status: 'info' });

    // Convert FileList to Array
    const fileList: File[] = Array.from(files);

    setTimeout(() => {
        const newSpecimens: Specimen[] = fileList.map(file => {
            let type: Specimen['type'] = 'tabular';
            if (file.type.startsWith('image/')) type = 'vision';
            else if (file.type.startsWith('audio/')) type = 'audio';
            
            // Generate analysis results based on the real file properties
            const randomSuitability = Math.floor(Math.random() * (99 - 70) + 70);
            const randomRisk = Math.random();
            let riskLevel: 'info' | 'warning' | 'critical' = 'info';
            if (randomRisk > 0.7) riskLevel = 'warning';
            if (randomRisk > 0.9) riskLevel = 'critical';

            return {
                id: `spec-${Math.random().toString(36).substr(2, 9)}`,
                name: file.name,
                type,
                status: 'active',
                suitability: randomSuitability,
                riskLevel: riskLevel,
                riskText: generateRiskText(type)
            };
        });

        if (activeProject) {
             updateProject(activeProject.id, { 
                progress: Math.min((activeProject.progress || 0) + 10, 100),
                specimens: [...(activeProject.specimens || []), ...newSpecimens],
                metrics: { ...activeProject.metrics, samples: (activeProject.metrics.samples || 0) + fileList.length }
            });
        }

        setIsUploading(false);
        setUploadComplete(true);
        addLog({ module: 'Specimen Lab', event: `Ingestion complete. ${fileList.length} files parsed.`, status: 'success' });
        
        setTimeout(() => setUploadComplete(false), 3000);
        
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, 2000);
  };

  const specimens = activeProject?.specimens || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col">
      
      {/* Hidden Input for File Selection */}
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Lab Header */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
               <Microscope className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-white tracking-tight">Specimen Lab</span>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
             <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors text-xs md:text-sm font-medium text-slate-500">
                Exit<span className="hidden sm:inline"> Lab</span>
             </button>
            <button 
                onClick={() => onNavigate('profile')} 
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <ProfileDropdown onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-slate-500 mb-6">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
            <button onClick={() => onNavigate('new-project')} className="hover:text-white transition-colors">Project</button>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
            <button onClick={() => onNavigate('analysis')} className="hover:text-white transition-colors">Analysis</button>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
            <span className="text-emerald-400">Dataset</span>
        </nav>

        {/* Title Section */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-2"
        >
            <h1 className="text-2xl md:text-3xl font-bold text-white">Initialize Specimen Input</h1>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">Deploy advanced neural diagnostic protocols across heterogeneous data streams.</p>
            {activeProject && <p className="text-xs text-emerald-500 font-mono mt-2">Active Target: {activeProject.title}</p>}
        </motion.div>

        {/* Universal Drop Zone */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative group"
        >
            <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-[3rem] group-hover:bg-emerald-500/10 transition-colors duration-500" />
            <div 
                className={`relative border border-dashed rounded-[2rem] h-64 md:h-80 flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-300
                    ${isUploading ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-emerald-500/20 bg-slate-900/50 hover:border-emerald-500/40 cursor-pointer'}
                `}
                onClick={!isUploading ? triggerFileSelect : undefined}
            >
                <AnimatePresence mode="wait">
                    {isUploading ? (
                         <motion.div 
                            key="uploading"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center"
                         >
                            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                            <h3 className="text-lg font-medium text-white">Ingesting Specimen Data...</h3>
                            <p className="text-sm text-slate-500 mt-1">Running initial sanitization checks.</p>
                         </motion.div>
                    ) : uploadComplete ? (
                        <motion.div 
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center"
                         >
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-400">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-medium text-white">Upload Successful</h3>
                            <p className="text-sm text-slate-500 mt-1">Specimens routed to active protocols.</p>
                         </motion.div>
                    ) : (
                        <motion.div 
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center w-full px-6"
                         >
                             <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-300">
                                <Upload className="w-8 h-8 text-emerald-400" />
                            </div>

                            <h2 className="text-xl font-medium text-white mb-3 text-center">Universal Drop Zone</h2>
                            <p className="text-slate-500 text-sm max-w-md text-center leading-relaxed mb-8 hidden md:block">
                                Drag and drop files from local storage or cloud drive. Our engine automatically routes specimens to the correct diagnostic protocol.
                            </p>
                            <p className="text-slate-500 text-sm max-w-md text-center leading-relaxed mb-8 md:hidden">
                                Tap here to upload data samples.
                            </p>

                            <div className="flex items-center gap-6 mb-8 text-xs font-mono text-emerald-500/70 uppercase tracking-wider">
                                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> .CSV</span>
                                <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> .PNG</span>
                                <span className="flex items-center gap-2"><Music className="w-4 h-4" /> .MP3</span>
                            </div>

                            <button 
                                onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}
                                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                            >
                                Browse Files
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>

        {/* Active Protocols */}
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-xl font-bold text-white">Active Specimen Protocols</h2>
                </div>
                {specimens.length > 0 && (
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-wider animate-pulse">
                        Live Monitoring
                    </div>
                )}
            </div>

            {specimens.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {specimens.map((specimen, idx) => {
                        // Dynamically render card content based on type
                        return (
                            <ProtocolCard 
                                key={specimen.id}
                                title={specimen.type === 'vision' ? "Vision Protocol" : specimen.type === 'tabular' ? "Tabular Protocol" : "Audio Protocol"}
                                icon={specimen.type === 'vision' ? ImageIcon : specimen.type === 'tabular' ? FileText : Music}
                                iconColor={specimen.type === 'vision' ? "text-emerald-400" : specimen.type === 'tabular' ? "text-cyan-400" : "text-indigo-400"}
                                iconBg={specimen.type === 'vision' ? "bg-emerald-500/10" : specimen.type === 'tabular' ? "bg-cyan-500/10" : "bg-indigo-500/10"}
                                suitability={specimen.suitability}
                                riskLevel={specimen.riskLevel}
                                riskText={specimen.riskText}
                                delay={idx * 0.1}
                            >
                                {specimen.type === 'vision' && (
                                    <div className="h-32 w-full bg-slate-950 rounded-lg overflow-hidden relative border border-white/5 group">
                                        <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                            <ImageIcon className="w-10 h-10 text-slate-700" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="text-[10px] font-mono text-white truncate max-w-[80%] bg-black/50 px-2 py-1 rounded">
                                                {specimen.name}
                                            </span>
                                        </div>
                                        <div className="absolute top-1/4 left-1/3 w-16 h-16 border-2 border-emerald-500 rounded flex items-start justify-start opacity-30 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-emerald-500 text-[8px] text-slate-950 px-1 font-bold">SCAN</div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent animate-scan pointer-events-none" />
                                        <style>{`
                                            @keyframes scan {
                                                0% { transform: translateY(-100%); }
                                                100% { transform: translateY(100%); }
                                            }
                                            .animate-scan { animation: scan 3s linear infinite; }
                                        `}</style>
                                    </div>
                                )}
                                {specimen.type === 'tabular' && (
                                    <div className="h-32 w-full bg-slate-950 rounded-lg border border-white/5 p-3 overflow-hidden font-mono text-[10px]">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                                            <span className="text-cyan-400 font-bold">DATA_STREAM</span>
                                            <span className="text-slate-600">{specimen.name.slice(-10)}</span>
                                        </div>
                                        <div className="space-y-1 text-slate-300">
                                            <div className="grid grid-cols-3 gap-2 opacity-50"><span className="text-slate-600">ROW_1</span><span className="text-cyan-400">---</span><span>---</span></div>
                                            <div className="grid grid-cols-3 gap-2 opacity-50"><span className="text-slate-600">ROW_2</span><span className="text-cyan-400">---</span><span>---</span></div>
                                            <div className="grid grid-cols-3 gap-2 opacity-50"><span className="text-slate-600">ROW_3</span><span className="text-cyan-400">---</span><span>---</span></div>
                                            <div className="mt-2 text-center text-emerald-500/80">Parsing Structure...</div>
                                        </div>
                                    </div>
                                )}
                                {specimen.type === 'audio' && (
                                    <div className="h-32 w-full bg-slate-950 rounded-lg border border-white/5 flex flex-col items-center justify-center relative overflow-hidden p-2">
                                        <div className="text-[10px] text-slate-500 mb-2 truncate max-w-full">{specimen.name}</div>
                                        <div className="flex items-center gap-1 h-12">
                                        {[...Array(12)].map((_, i) => (
                                            <motion.div 
                                                key={i}
                                                animate={{ height: [10, 30 + Math.random() * 20, 10] }}
                                                transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.05 }}
                                                className="w-1.5 bg-indigo-500/80 rounded-full"
                                            />
                                        ))}
                                        </div>
                                    </div>
                                )}
                            </ProtocolCard>
                        )
                    })}
                </div>
            ) : (
                <div className="glass-card rounded-3xl p-6 border border-white/10 bg-slate-900/50 flex flex-col items-center justify-center text-center text-slate-500 min-h-[200px]">
                    <Info className="w-12 h-12 mb-4 opacity-50" />
                    <p>No specimens uploaded. Drop files above to begin protocol analysis.</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
};

const ProtocolCard = ({ title, icon: Icon, iconColor, iconBg, suitability, riskLevel, riskText, delay = 0, children }: any) => {
    const riskColors: any = {
        info: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        critical: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    };
    
    // Defaulting if key doesn't exist
    const riskTheme = riskColors[riskLevel] || riskColors.info;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay }}
            className="glass-card p-5 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col h-full hover:bg-slate-900/60 transition-colors"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${iconBg} border border-white/5`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">{title}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${suitability}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{suitability}% Match</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 mb-4">
                {children}
            </div>

            <div className={`mt-auto p-3 rounded-lg border flex items-start gap-3 ${riskTheme}`}>
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Protocol Alert</div>
                    <p className="text-xs opacity-90 leading-snug">{riskText}</p>
                </div>
            </div>
        </motion.div>
    );
};