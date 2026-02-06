import React, { useState } from 'react';
import { 
  Search, 
  ScanLine, 
  ShieldAlert, 
  Zap, 
  Globe, 
  Cpu, 
  ArrowRight, 
  LayoutGrid,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext';
import { ProfileDropdown } from './ProfileDropdown';
import { GoogleGenAI } from "@google/genai";

interface NoveltyPageProps {
  onNavigate: (page: 'dashboard' | 'library' | 'specimen-lab' | 'analysis' | 'new-project' | 'profile') => void;
}

export const NoveltyPage: React.FC<NoveltyPageProps> = ({ onNavigate }) => {
  const { getActiveProject, updateProject, addLog } = useApp();
  const activeProject = getActiveProject();
  
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
      if (!activeProject) return;
      
      setIsScanning(true);
      addLog({ module: 'Novelty', event: `Started literature scan for ${activeProject.title}`, status: 'info' });

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemPrompt = `
            You are a rigorous academic novelty engine. Your task is to analyze the user's research hypothesis and generate 3 "conflicting" or "related" academic papers that might challenge the novelty of their work.
            
            Current Hypothesis: "${activeProject.hypothesis}"
            Assumptions: ${activeProject.assumptions.join(', ')}

            Return a JSON object with a 'papers' array. Each paper should have:
            - id: string (e.g. "ArXiv-2301")
            - title: string
            - similarity: number (0-100 score of overlap)
            - status: "critical" | "warning" | "safe" (based on similarity > 70 critical, > 30 warning)
            - abstract: string (1-2 sentences summarizing the paper and how it overlaps)
            
            The papers should sound real but can be hallucinated for this simulation.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
            config: { responseMimeType: "application/json" }
        });

        const result = JSON.parse(response.text || '{ "papers": [] }');
        const papers = result.papers || [];

        // Add visual placeholders since AI doesn't generate images yet
        const enrichedPapers = papers.map((p: any) => ({
            ...p,
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400" // Generic abstract background
        }));

        updateProject(activeProject.id, { 
            noveltyPapers: enrichedPapers,
            metrics: { ...activeProject.metrics, noveltyIndex: enrichedPapers.length > 0 ? enrichedPapers[0].similarity / 100 : 0.1 }
        });
        
        setSelectedPaper(enrichedPapers[0]);
        addLog({ module: 'Novelty', event: `Scan complete. ${enrichedPapers.length} collisions found.`, status: 'warning' });

      } catch (e) {
          console.error(e);
          addLog({ module: 'Novelty', event: `Scan failed to connect to archive.`, status: 'error' });
      } finally {
          setIsScanning(false);
      }
  };

  const getThreatLevel = (sim: number) => {
    if (sim >= 70) return { label: 'High', color: 'text-rose-500', gaugeColor: '#f43f5e' };
    if (sim >= 30) return { label: 'Moderate', color: 'text-amber-500', gaugeColor: '#fbbf24' };
    return { label: 'Low', color: 'text-emerald-500', gaugeColor: '#10b981' };
  };

  const papers = activeProject?.noveltyPapers || [];
  const currentPaper = selectedPaper || papers[0];
  const threat = currentPaper ? getThreatLevel(currentPaper.similarity) : { label: 'Low', color: 'text-emerald-500', gaugeColor: '#10b981' };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col">
      
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
               <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-bold text-white tracking-widest uppercase text-sm">NOVELTY POLICE</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
            <button onClick={() => onNavigate('specimen-lab')} className="hover:text-white transition-colors">Dataset</button>
            <button onClick={() => onNavigate('library')} className="hover:text-white transition-colors">Library</button>
            <button className="text-cyan-400">Novelty</button>
          </nav>

          <div className="flex items-center gap-4">
            <ProfileDropdown onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-slate-500 mb-6">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
            <button onClick={() => onNavigate('new-project')} className="hover:text-white transition-colors">Project</button>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
            <button onClick={() => onNavigate('analysis')} className="hover:text-white transition-colors">Analysis</button>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
            <span className="text-cyan-400">Novelty</span>
        </nav>

        {/* Archive Interrogator Section */}
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wide mb-1">Archive Interrogator</h2>
                <p className="text-slate-400 text-sm">Scan global repositories for novelty collision. Select a paper to duel.</p>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder={activeProject ? "Enter thesis keywords or upload abstract..." : "Create a project to scan..."}
                        disabled={!activeProject}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 disabled:opacity-50"
                    />
                </div>
                <button 
                    onClick={handleScan}
                    disabled={isScanning || !activeProject}
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_-5px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isScanning ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            SCANNING...
                        </>
                    ) : (
                        <>
                            <ScanLine className="w-4 h-4" />
                            SCAN PAPERS
                        </>
                    )}
                </button>
            </motion.div>

            {/* Paper Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6 min-h-[200px]">
                {papers.length > 0 ? (
                    papers.map((paper, index) => (
                        <PaperCard 
                            key={paper.id}
                            {...paper}
                            isSelected={currentPaper?.id === paper.id}
                            onClick={() => setSelectedPaper(paper)}
                            index={index}
                        />
                    ))
                ) : (
                    <div className="col-span-3 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-slate-900/20 p-12 text-center">
                        <ShieldAlert className="w-12 h-12 text-slate-600 mb-4" />
                        <h3 className="text-slate-400 font-medium">No Novelty Data</h3>
                        <p className="text-slate-500 text-sm mt-1">Initialize a scan to check your thesis against global archives.</p>
                    </div>
                )}
            </div>
        </div>

        {/* The Duel Arena */}
        {currentPaper && (
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="pt-8 space-y-8"
            >
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <h2 className="text-lg font-bold text-white uppercase tracking-widest italic">The Duel Arena</h2>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 items-stretch">
                    
                    {/* Left: Your Thesis */}
                    <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-cyan-500/30 bg-cyan-500/[0.02] flex flex-col order-1 lg:order-1">
                        <div className="flex items-center gap-2 mb-4 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                            Your Research Thesis
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed font-mono">
                            "{activeProject?.hypothesis || 'No hypothesis defined.'}"
                        </p>
                    </div>

                    {/* Center: Gauge */}
                    <div className="lg:col-span-1 flex flex-col items-center justify-center relative order-2 lg:order-2 py-4 lg:py-0">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="6" />
                                <motion.circle 
                                    key={currentPaper.id}
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: currentPaper.similarity / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    cx="50" cy="50" r="45" fill="none" stroke={threat.gaugeColor} strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                />
                            </svg>
                            <div className="absolute text-center">
                                <motion.div 
                                    key={`text-${currentPaper.id}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-3xl font-bold text-white"
                                >
                                    {currentPaper.similarity}%
                                </motion.div>
                            </div>
                        </div>
                        <div className="text-center mt-2 space-y-1">
                            <div className={`text-[10px] font-bold ${threat.color} uppercase tracking-wider`}>Novelty Threat: {threat.label}</div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-wide">Collision with Paper {currentPaper.id}</div>
                        </div>
                    </div>

                    {/* Right: Existing Thesis */}
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentPaper.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="lg:col-span-3 glass-card rounded-2xl p-6 border border-rose-500/30 bg-rose-500/[0.02] flex flex-col order-3 lg:order-3"
                        >
                            <div className="flex items-center gap-2 mb-4 text-rose-500 text-xs font-bold uppercase tracking-wider">
                                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                                Existing Archive Thesis
                            </div>
                            <div className="mb-4">
                                <h3 className="text-white font-bold leading-tight">{currentPaper.title}</h3>
                                <span className="text-[10px] text-slate-500 font-mono">ID: {currentPaper.id}</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed font-mono">
                                "{currentPaper.abstract}"
                            </p>
                        </motion.div>
                    </AnimatePresence>

                </div>
            </motion.div>
        )}

        {/* Strategy Pivot Panel - Show only if we have results */}
        {papers.length > 0 && (
            <div className="pt-8 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-1">Strategy Pivot Panel</h2>
                    <p className="text-slate-400 text-sm">AI-suggested maneuvers to regain novelty status.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    <PivotCard 
                        type="DOMAIN PIVOT"
                        icon={Globe}
                        color="text-emerald-400"
                        borderColor="border-emerald-500/30"
                        desc="Shift focus from general agriculture to Ag-Tech vertical optimization specifically for hyper-arid soil types."
                        delay={0.1}
                    />
                    <PivotCard 
                        type="METHOD PIVOT"
                        icon={LayoutGrid}
                        color="text-cyan-400"
                        borderColor="border-cyan-500/30"
                        desc="Replace current CNN backbone with Spatio-Temporal Transformers for 4D environmental mapping."
                        delay={0.2}
                    />
                    <PivotCard 
                        type="CONSTRAINT PIVOT"
                        icon={Cpu}
                        color="text-indigo-400"
                        borderColor="border-indigo-500/30"
                        desc="Adapt the entire model for Ultra-Low Power Edge Devices with 90% parameter pruning."
                        delay={0.3}
                    />
                </div>
            </div>
        )}

      </main>

      {/* Footer Actions */}
      <footer className="border-t border-white/5 bg-slate-950 sticky bottom-0 z-40 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Session</span>
            </div>
        </div>
      </footer>

    </div>
  );
};

// --- Sub-components ---

const PaperCard = ({ title, id, similarity, image, status, isSelected, onClick, index = 0 }: any) => {
    const statusColors: any = {
        critical: { text: "text-rose-500", border: "border-rose-500/30" },
        warning: { text: "text-amber-400", border: "border-amber-500/30" },
        safe: { text: "text-emerald-400", border: "border-emerald-500/30" }
    };
    const theme = statusColors[status];
    const selectedStyles = isSelected 
        ? "ring-2 ring-cyan-500 border-cyan-500/50 shadow-[0_0_30px_-5px_rgba(34,211,238,0.2)] scale-[1.02]" 
        : `border-white/10 ${theme.border} hover:border-white/30 hover:scale-[1.01]`;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={onClick}
            className={`glass-card p-4 rounded-xl border ${selectedStyles} group relative overflow-hidden cursor-pointer transition-all duration-300`}
        >
            {/* Image Area */}
            <div className="h-32 w-full bg-slate-900 rounded-lg mb-4 overflow-hidden relative">
                <img src={image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt={title} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                {/* Similarity Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/60 backdrop-blur-sm">
                    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded text-xs font-medium text-white">
                        {isSelected ? 'Selected' : 'Click to Duel'}
                    </span>
                </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
            
            <div className="flex items-center justify-between font-mono text-xs">
                <span className={`${theme.text}`}>Similarity: {similarity}%</span>
                <span className="text-slate-600 border border-white/10 px-1.5 py-0.5 rounded text-[10px]">ID: {id}</span>
            </div>
        </motion.div>
    )
}

const PivotCard = ({ type, icon: Icon, color, borderColor, desc, delay = 0 }: any) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5, delay }}
        className={`glass-card p-6 rounded-2xl border ${borderColor} bg-slate-900/40 hover:bg-slate-900/60 transition-colors group cursor-pointer`}
    >
        <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded bg-slate-950 border border-white/10`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">{type}</h3>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed mb-6 min-h-[60px]">
            {desc}
        </p>
        <div className="flex justify-end">
            <ArrowRight className={`w-4 h-4 ${color} group-hover:translate-x-1 transition-transform`} />
        </div>
    </motion.div>
);