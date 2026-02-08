import React, { useState } from 'react';
import { 
  Box, 
  User, 
  UploadCloud, 
  X, 
  Plus, 
  BarChart2, 
  CheckCircle2, 
  Lock, 
  HelpCircle,
  FileText,
  ChevronRight,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext';
import { ProfileDropdown } from './ProfileDropdown';
import { MobileNav } from './MobileNav';
import { Menu } from 'lucide-react';
import { callAI } from '../lib/ai';

interface NewProjectWizardProps {
  onNavigate: (page: 'dashboard' | 'library' | 'specimen-lab' | 'analysis' | 'novelty' | 'profile') => void;
}

export const NewProjectWizard: React.FC<NewProjectWizardProps> = ({ onNavigate }) => {
  const [title, setTitle] = useState('');
  const [assumptions, setAssumptions] = useState([
    'Closed System', 'Infinite Compute', 'Static Dataset'
  ]);
  const [hypothesis, setHypothesis] = useState("Developing a sub-linear time complexity algorithm for multi-agent pathfinding in non-Euclidean space using quantum-inspired heuristics.");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fullContent, setFullContent] = useState('');
  const [initialMetrics, setInitialMetrics] = useState<any>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { createProject, addLog } = useApp();

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    setTitle('');
    setFullContent('');
    setHypothesis("Developing a sub-linear time complexity algorithm for multi-agent pathfinding in non-Euclidean space using quantum-inspired heuristics.");
    setAssumptions(['Closed System', 'Infinite Compute', 'Static Dataset']);
    setInitialMetrics(null);
    setUploadProgress(0);
  };

  const extractPdfText = async (file: File): Promise<string> => {
    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) return `[PDF extraction unavailable: pdfjsLib not loaded]`;
    
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = "";
        
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) { // Limit to 10 pages for speed/tokens
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item: any) => item.str);
            fullText += strings.join(" ") + "\n";
        }
        return fullText;
    } catch (e) {
        console.error("PDF Extraction failed:", e);
        return `[PDF extraction failed: ${file.name}]`;
    }
  };

  const handleFileUpload = async (file: File) => {
    console.log('📂 handleFileUpload called with file:', file.name, file.type, file.size);
    setIsUploading(true);
    setUploadProgress(10);
    addLog({ module: 'Intake', event: `Reading ${file.name}...`, status: 'info' });

    try {
        let content: string;
        
        if (file.type === 'application/pdf') {
            // Handle PDF files
            try {
                content = await extractPdfText(file);
            } catch (pdfError) {
                console.warn("PDF specific extraction failed", pdfError);
                content = `[PDF Content Extraction Failed]`;
            }
        } else {
            // Handle text files
            content = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string || '');
                reader.onerror = reject;
                reader.readAsText(file);
            });
        }

        if (!content || content.length < 50) {
            console.warn("Extracted content is very short:", content);
            addLog({ module: 'Intake', event: `Warning: Low content extracted from ${file.name} (${content?.length || 0} chars)`, status: 'warning' });
        } else {
            addLog({ module: 'Intake', event: `Read ${content.length} characters from ${file.name}`, status: 'success' });
        }

        setFullContent(content);
        setUploadProgress(50);
        
        if (content && content.length > 50) {
            addLog({ module: 'Intake', event: `Extracting insights from ${file.name}...`, status: 'info' });
            
            const extractPrompt = `
                Analyze this document content and extract the primary research hypothesis and a list of key assumptions.
                Also, provide an initial assessment of Logic Consistency, Data Lineage, and Novelty (0-100).
                And provide 5 "Radar Chart" coordinates as numbers (0-100) representing: [Rigor, Consistency, Lineage, Novelty, Methodology].
                Return result as JSON: { 
                    "hypothesis": "...", 
                    "assumptions": ["...", "..."],
                    "metrics": { "logic": 0, "lineage": 0, "novelty": 0, "radar": [50, 50, 50, 50, 50] }
                }
                
                CONTENT:
                ${content.slice(0, 4000)}
            `;

            const result = await callAI(extractPrompt, [], { responseMimeType: 'application/json' });
            try {
                const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim();
                const data = JSON.parse(cleaned);
                if (data.hypothesis) setHypothesis(data.hypothesis);
                if (data.assumptions) setAssumptions(data.assumptions);
                if (data.metrics) setInitialMetrics(data.metrics);
            } catch (e) {
                console.warn("AI extraction failed, using fallback.", e);
            }
        }

        if (!title) setTitle(file.name.split('.')[0]);
        setUploadedFile(file);
        setUploadProgress(100);
        addLog({ module: 'Intake', event: `${file.name} processed successfully.`, status: 'success' });

    } catch (error) {
        console.error("File processing error:", error);
        addLog({ module: 'Intake', event: `Failed to process ${file.name}`, status: 'error' });
    } finally {
        setIsUploading(false);
    }
  };

  /**
   * Initializes a new research project in the global state.
   */
  const handleCreate = () => {
    createProject({
      title: title || "New Research Initiative " + new Date().toLocaleDateString(),
      hypothesis: hypothesis,
      assumptions: assumptions,
      fullContent: fullContent,
      status: "ANALYZING",
      progress: 0,
      metrics: {
          confidence: initialMetrics ? Math.round((initialMetrics.logic + initialMetrics.lineage + initialMetrics.novelty) / 3) : 0,
          samples: 0,
          computeTime: "0h 1m",
          logicConsistency: initialMetrics ? initialMetrics.logic / 100 : 0,
          dataLineage: initialMetrics ? initialMetrics.lineage / 100 : 0,
          noveltyIndex: initialMetrics ? initialMetrics.novelty / 100 : 0,
          radar: initialMetrics?.radar ? initialMetrics.radar.join(',') : "50,50,50,50,50"
      }
    });
    onNavigate('analysis');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col">
      
      {/* Wizard Header */}
      <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
               <Box className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-white tracking-tight">Project</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
            <button onClick={() => onNavigate('analysis')} className="text-white bg-white/5 px-3 py-1 rounded-lg transition-colors">Analysis</button>
            <button onClick={() => onNavigate('specimens')} className="hover:text-white transition-colors">Dataset</button>
            <button onClick={() => onNavigate('library')} className="hover:text-white transition-colors">Library</button>
            <button onClick={() => onNavigate('novelty')} className="hover:text-white transition-colors">Novelty</button>
          </nav>

          <div className="flex items-center gap-4">
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

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-slate-500 mb-6">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
        </nav>

        {/* Research Intake Phase */}
        <div className="space-y-6">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
           >
              <h2 className="text-2xl font-bold text-white">Research Intake Phase</h2>
              <p className="text-slate-400 text-sm mt-1">
                 Upload your proposal and verify the manifest metadata to begin dead-end analysis.
              </p>
           </motion.div>

           {/* Drop Zone */}
           <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`border border-dashed ${isUploading ? 'border-emerald-500 bg-emerald-500/10' : uploadedFile ? 'border-emerald-500 bg-emerald-500/10' : 'border-emerald-500/30 bg-emerald-500/[0.02]'} rounded-3xl h-64 flex flex-col items-center justify-center relative group hover:bg-emerald-500/[0.05] transition-all cursor-pointer overflow-hidden`}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const files = e.dataTransfer.files;
                if (files && files.length > 0) handleFileUpload(files[0]);
              }}
              onClick={() => !uploadedFile && fileInputRef.current?.click()}
           >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden"
                onChange={(e) => {
                  console.log('📁 File input onChange fired', e.target.files);
                  if (e.target.files && e.target.files.length > 0) {
                    console.log('📁 Calling handleFileUpload with:', e.target.files[0].name);
                    handleFileUpload(e.target.files[0]);
                  }
                  // Reset input value to allow re-uploading the same file if needed
                  e.target.value = '';
                }}
                accept=".pdf,application/pdf,.md,.txt,text/plain,.tex"
              />
              
              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center z-10"
                  >
                    <div className="relative w-16 h-16 mb-4">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full border-4 border-emerald-500/30 border-t-emerald-500 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-mono text-emerald-400">{uploadProgress}%</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">Analyzing Document Structure...</h3>
                    <p className="text-emerald-400 text-xs font-mono animate-pulse">Extracting Hypothsis & Assumptions</p>
                  </motion.div>
                ) : uploadedFile ? (
                   <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center z-20 w-full px-6"
                  >
                    <div className="flex items-center gap-4 bg-slate-900/80 border border-emerald-500/30 p-4 rounded-xl w-full max-w-md backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <FileText className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <h4 className="text-white font-medium truncate text-sm">{uploadedFile.name}</h4>
                            <p className={`text-xs mt-0.5 ${uploadProgress === 100 ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {uploadProgress === 100 ? 'Ready for Analysis' : 'Processing...'} 
                                <span className="text-slate-500 ml-1">• {(uploadedFile.size / 1024).toFixed(1)} KB</span>
                            </p>
                        </div>
                        <button 
                            onClick={handleRemoveFile}
                            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="mt-4 flex flex-col items-center">
                         <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
                            <CheckCircle2 className="w-3 h-3" />
                            Extraction Complete
                         </div>
                         <p className="text-slate-500 text-xs">Review the manifest below before proceeding.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center z-10"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20 group-hover:border-emerald-500/50 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
                       <UploadCloud className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Drop Research Proposal</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-sm text-center">
                      Support for PDF, LaTeX (ZIP), or Markdown. <br/>
                      <span className="text-emerald-500/60 text-xs">AI will auto-extract hypothesis and claims.</span>
                    </p>
                    
                    <button 
                       type="button"
                       onClick={(e) => {
                         e.stopPropagation();
                         fileInputRef.current?.click();
                       }}
                       className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-lg shadow-emerald-500/20"
                    >
                       Browse Files
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
           </motion.div>
        </div>

        {/* Digital Manifest Clipboard */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
        >
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-medium">
                 <FileText className="w-4 h-4 text-emerald-500" />
                 Digital Manifest Clipboard
              </div>
           </div>

           <div className="glass-card p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-white/10">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                 {/* Hypothesis */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       Hypothesis / Research Question
                    </label>
                    <textarea 
                       className="w-full h-32 bg-slate-950/50 border border-white/10 rounded-lg p-4 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-all resize-none leading-relaxed"
                       value={hypothesis}
                       onChange={(e) => setHypothesis(e.target.value)}
                    />
                 </div>

                 {/* Assumptions */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                       <span className="text-emerald-500">=x</span>
                       Research Assumptions
                    </label>
                    <div className="bg-slate-950/50 border border-white/10 rounded-lg p-4 h-32 overflow-y-auto">
                       <div className="flex flex-wrap gap-2">
                          <AnimatePresence>
                            {assumptions.map((tag, i) => (
                               <motion.span 
                                 key={tag}
                                 initial={{ opacity: 0, scale: 0.8 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 exit={{ opacity: 0, scale: 0.8 }}
                                 className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono"
                               >
                                  {tag}
                                  <button className="hover:text-white" onClick={() => setAssumptions(assumptions.filter((_, idx) => idx !== i))}>
                                     <X className="w-3 h-3" />
                                  </button>
                               </motion.span>
                            ))}
                          </AnimatePresence>
                          <button 
                             onClick={() => setAssumptions([...assumptions, 'New Assumption'])}
                             className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-dashed border-slate-700 text-slate-500 text-xs font-mono hover:text-white hover:border-slate-500 transition-colors"
                          >
                             <Plus className="w-3 h-3" />
                             Add Assumption
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Bottom Row */}
              <div className="flex flex-col md:flex-row items-end gap-6">
                 <div className="flex-1 w-full space-y-2">
                    <label className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                       <Database className="w-3 h-3 text-emerald-500" />
                       Primary Data Source
                    </label>
                    <div className="relative">
                       <input 
                          type="text" 
                          defaultValue="arXiv Open Repository"
                          className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-4 pr-10 py-3 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-all"
                       />
                       <div className="absolute right-3 top-3 text-emerald-500 opacity-50 text-[10px]">▼</div>
                    </div>
                 </div>

                 <button 
                    onClick={handleCreate}
                    className="w-full md:w-auto px-8 py-3 btn-primary rounded-lg flex items-center justify-center gap-2"
                 >
                    <BarChart2 className="w-5 h-5" />
                    Analyze for Dead-Ends
                 </button>
              </div>
           </div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 bg-slate-950">
         <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
               <CheckCircle2 className="w-3 h-3 text-emerald-500" />
               Verified by Emerald AI Engine
            </div>
            <div className="flex items-center gap-2">
               <Lock className="w-3 h-3" />
               End-to-End Encrypted Intake
            </div>
            <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
               <HelpCircle className="w-3 h-3" />
               Support Available
            </div>
         </div>
      </footer>

      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
        onNavigate={onNavigate}
        currentPage="new-project"
      />
    </div>
  );
};
