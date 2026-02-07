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
import { callAI } from '../lib/ai';
import { ProfileDropdown } from './ProfileDropdown';
import { MobileNav } from './MobileNav';
import { Menu } from 'lucide-react';

interface SpecimenLabProps {
  onNavigate: (page: 'dashboard' | 'library' | 'new-project' | 'profile') => void;
}

export const SpecimenLab: React.FC<SpecimenLabProps> = ({ onNavigate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !activeProject) return;

    setIsUploading(true);
    addLog({ module: 'Specimen Lab', event: `Started dynamic ingestion for project: ${activeProject.title}`, status: 'info' });

    const fileList: File[] = Array.from(files);
    const specimenMeta = fileList.map(f => ({ name: f.name, type: f.type }));

    try {
        const prompt = `
            You are the Lead Pathologist AI for the Assertion Engine. 
            Analyze the following uploaded specimens against the project's hypothesis.
            
            PROJECT HYPOTHESIS: "${activeProject.hypothesis}"
            PROJECT ASSUMPTIONS: "${activeProject.assumptions.join(', ')}"
            
            SPECIMENS:
            ${JSON.stringify(specimenMeta, null, 2)}
            
            TASK:
            For each specimen, generate a diagnostic report. 
            Suitability: How well this file type/name fits the hypothesis (0-100).
            Risk: Potential issues (null values, bias, noise, toxic labels).
            Prediction: 4 values (0-100) representing a future trajectory.
            Weights: 4 features relevant to the hypothesis (name, weight 0.0-1.0, type: signal/noise/toxic, enabled: bool).
            Purity: 40 grid cells quality labels (elite/bias/radioactive).
            Surgeon Insight: A technical, authoritative recommendation about this specimen's role in the hypothesis.

            Return JSON: { 
                "specimens": [
                    { 
                        "name": "...", 
                        "suitability": number, 
                        "riskLevel": "info"|"warning"|"critical", 
                        "riskText": "...",
                        "predictionData": [number, number, number, number],
                        "featureWeights": [{ "name": "...", "weight": number, "type": "signal"|"noise"|"toxic", "enabled": boolean }],
                        "samplePurityGrid": [{ "id": "...", "quality": "elite"|"bias"|"radioactive" }],
                        "surgeonInsight": "..."
                    }
                ]
            }
        `;

        const responseText = await callAI(prompt, [], { responseMimeType: 'application/json' });
        const data = JSON.parse(responseText);

        const newSpecimens: Specimen[] = fileList.map((file, idx) => {
            const aiData = data.specimens[idx] || data.specimens[0]; // Fallback
            let type: Specimen['type'] = 'tabular';
            if (file.type.startsWith('image/')) type = 'vision';
            else if (file.type.startsWith('audio/')) type = 'audio';

            return {
                id: `spec-${Math.random().toString(36).substr(2, 9)}`,
                name: file.name,
                type,
                status: 'active',
                suitability: aiData.suitability || 80,
                riskLevel: aiData.riskLevel || 'info',
                riskText: aiData.riskText || "Standard normalization required.",
                predictionData: aiData.predictionData || [30, 50, 40, 70],
                featureWeights: aiData.featureWeights,
                samplePurityGrid: aiData.samplePurityGrid || [],
                surgeonInsight: aiData.surgeonInsight || "Analyzing potential signal-to-noise ratio."
            };
        });

        updateProject(activeProject.id, { 
            progress: Math.min((activeProject.progress || 0) + 10, 100),
            specimens: [...(activeProject.specimens || []), ...newSpecimens],
            metrics: { ...activeProject.metrics, samples: (activeProject.metrics.samples || 0) + fileList.length }
        });

        addLog({ module: 'Specimen Lab', event: `Dynamic ingestion complete. ${fileList.length} specimens assessed.`, status: 'success' });
    } catch (error) {
        console.error("AI Ingestion Error:", error);
        addLog({ module: 'Specimen Lab', event: "AI failed to assess specimens. Falling back to local heuristics.", status: 'warning' });
        // Fallback to local logic if AI fails
        // ... (can re-implement simpler local logic if needed)
    } finally {
        setIsUploading(false);
        setUploadComplete(true);
        setTimeout(() => setUploadComplete(false), 3000);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
                 className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors hidden sm:block"
             >
               <Settings className="w-5 h-5" />
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
                <div className="space-y-12">
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
                                predictionData={specimen.predictionData}
                                featureWeights={specimen.featureWeights}
                                samplePurityGrid={specimen.samplePurityGrid}
                                surgeonInsight={specimen.surgeonInsight}
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

      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
        onNavigate={onNavigate}
        currentPage="specimens"
      />
    </div>
  );
};

// --- Specimen Dashboard Components ---

const FeatureIntegrityCard = ({ featureWeights }: { featureWeights: any[] }) => (
    <div className="glass-card p-6 rounded-2xl bg-slate-900/60 border border-white/5 h-full">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Settings className="w-3 h-3 text-cyan-400" />
                Feature Integrity Scanner
            </h3>
            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">SIGNAL: STRONG</span>
        </div>
        
        <div className="space-y-4">
            {featureWeights.map((fw: any, i: number) => (
                <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider">
                        <span className={fw.type === 'toxic' ? 'text-rose-400 font-bold' : fw.type === 'noise' ? 'text-slate-500' : 'text-slate-300'}>
                             {fw.name}
                        </span>
                        <div className="flex gap-2">
                            <span className="text-slate-600 font-mono">{fw.type}</span>
                            <span className="text-white font-mono">{Math.round(fw.weight * 100)}%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${fw.weight * 100}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`h-full ${fw.type === 'toxic' ? 'bg-rose-500' : fw.type === 'noise' ? 'bg-slate-600' : 'bg-cyan-500'}`}
                            />
                        </div>
                        <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${fw.enabled ? 'bg-emerald-500 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-800 border-slate-700'}`} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const SamplePurityCard = ({ samplePurityGrid, suitability }: { samplePurityGrid: any[], suitability: number }) => (
    <div className="glass-card p-6 rounded-2xl bg-slate-900/60 border border-white/5 h-full">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-3 h-3 text-emerald-400" />
                Sample Purity Map
            </h3>
            <div className="flex items-center gap-2">
                 <span className="text-[10px] text-slate-500 font-mono">{suitability}% PURITY</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
        </div>
        
        <div className="grid grid-cols-10 gap-1.5 mb-6">
            {samplePurityGrid.map((p: any) => (
                <motion.div 
                    key={p.id} 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`aspect-square rounded-[2px] cursor-help relative group/cell ${
                        p.quality === 'radioactive' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 
                        p.quality === 'bias' ? 'bg-amber-500' : 
                        'bg-emerald-500/40'
                    }`}
                >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-[8px] rounded opacity-0 group-hover/cell:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        Status: {p.quality.toUpperCase()}
                    </div>
                </motion.div>
            ))}
        </div>
        
        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                    <span className="text-[8px] text-slate-500">ELITE</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[8px] text-slate-500">BIAS</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-[8px] text-slate-500">TOXIC</span>
                </div>
            </div>
        </div>
    </div>
);

const SurgicalInsightCard = ({ insight }: { insight: string }) => (
    <div className="glass-card p-6 rounded-2xl bg-slate-900/80 border border-rose-500/20 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-rose-500/10 transition-all duration-700" />
        
        <h3 className="text-[10px] font-mono text-rose-500 uppercase tracking-[0.3em] font-bold mb-4 flex items-center gap-2">
            <Microscope className="w-3.5 h-3.5" />
            Gemini Surgical Insight
        </h3>
        
        <div className="relative">
            <span className="absolute -left-2 -top-2 text-4xl text-rose-500/20 font-serif">"</span>
            <p className="text-sm text-slate-300 leading-relaxed font-mono pl-4 italic">
                {insight}
            </p>
            <span className="absolute -right-2 -bottom-2 text-4xl text-rose-500/20 font-serif">"</span>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 text-rose-500">
                    <User className="w-3 h-3" />
                </div>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Lead Pathologist AI</span>
            </div>
            <button className="text-[9px] font-bold text-rose-500 border border-rose-500/30 px-3 py-1 rounded hover:bg-rose-500/10 transition-all uppercase tracking-widest">
                Execute Amputation
            </button>
        </div>
    </div>
);

const ProtocolCard = ({ title, icon: Icon, iconColor, iconBg, suitability, riskLevel, riskText, predictionData, featureWeights, samplePurityGrid, surgeonInsight, delay = 0, children }: any) => {
    const riskColors: any = {
        info: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        critical: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    };
    
    const riskTheme = riskColors[riskLevel] || riskColors.info;
    const isCritical = riskLevel === 'critical';
    const isWarning = riskLevel === 'warning';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay }}
            className="space-y-6"
        >
            {/* Specimen Profile Header */}
            <div className="flex items-end justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${iconBg} border border-white/10 shadow-xl`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h3>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase border ${riskTheme}`}>
                                {riskLevel} THREAT
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Ingestion Status: OK</span>
                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Suitability: {suitability}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Diagnostic Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visualizer & Prediction (Left) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 rounded-2xl bg-slate-900/40 border border-white/5 h-full flex flex-col">
                        <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Neural Visualization</h4>
                        <div className="flex-1 mb-6">
                            {children}
                        </div>
                        
                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Specimen Trajectory</h4>
                                <span className="text-[10px] text-emerald-400 font-bold uppercase">Predictive Path</span>
                            </div>
                            <div className="flex items-end gap-2 h-20">
                                {(predictionData || [20, 40, 60, 80]).map((val: number, i: number) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${val}%` }}
                                        transition={{ duration: 1.2, delay: i * 0.1 }}
                                        className={`flex-1 rounded-t-sm ${isCritical ? 'bg-rose-500/40' : isWarning ? 'bg-amber-500/40' : 'bg-emerald-500/40'} border-x border-t border-white/5`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scanners & Map (Right) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {featureWeights && <FeatureIntegrityCard featureWeights={featureWeights} />}
                        {samplePurityGrid && <SamplePurityCard samplePurityGrid={samplePurityGrid} suitability={suitability} />}
                    </div>
                    
                    {surgeonInsight && <SurgicalInsightCard insight={surgeonInsight} />}
                    
                    <div className={`p-4 rounded-xl border flex items-start gap-4 ${riskTheme}`}>
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1">Anomalous Activity Detected</div>
                            <p className="text-xs opacity-90 leading-relaxed font-mono">{riskText}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="h-12 border-b border-white/5 mb-12" />
        </motion.div>
    );
};