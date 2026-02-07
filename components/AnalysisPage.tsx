import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  ArrowRight, 
  Database, 
  Zap, 
  LayoutGrid, 
  User, 
  Plus,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  ChevronRight,
  Shield,
  Target,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext';
import { callAI } from '../lib/ai';
import { ProfileDropdown } from './ProfileDropdown';
import { MobileNav } from './MobileNav';
import { Menu } from 'lucide-react';

interface AnalysisPageProps {
  onNavigate: (page: 'dashboard' | 'library' | 'specimen-lab' | 'profile' | 'new-project' | 'novelty') => void;
}

interface Message {
    id: string;
    role: 'ai' | 'user';
    text: string;
    timestamp: string;
}

interface Vulnerability {
  type: 'CRITICAL' | 'MODERATE' | 'SUGGESTION';
  title: string;
  desc: string;
  riskScore: string;
  action: string;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ onNavigate }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getActiveProject, updateProject, user, addLog } = useApp();
  const activeProject = getActiveProject();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Reset messages when switching projects
  useEffect(() => {
      setMessages([]);
  }, [activeProject?.id]);

  useEffect(() => {
    if (activeProject && messages.length === 0) {
        if (activeProject.analysisChat && activeProject.analysisChat.length > 0) {
             setMessages(activeProject.analysisChat.map((m, i) => ({...m, id: i.toString()})));
        } else {
             const initialMsg: Message = {
                id: 'init',
                role: 'ai',
                text: `I have initialized the validation protocol for: **"${activeProject.title}"**.\n\nYour hypothesis: *"${activeProject.hypothesis}"*\n\nI am scanning for logical inconsistencies, data lineage gaps, and novelty threats. What specific aspect would you like me to stress-test first?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([initialMsg]);
        }
    }
  }, [activeProject, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !activeProject || isTyping) return;

    const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        text: input,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    
    updateProject(activeProject.id, { 
        analysisChat: newMessages.map(m => ({ role: m.role, text: m.text, timestamp: m.timestamp })) 
    });

    try {
        const systemPrompt = `You are an advanced academic research validator AI named "Assertion Engine". 
        Your goal is to stress-test the user's research hypothesis. 
        Current Project Title: ${activeProject.title}
        Current Hypothesis: ${activeProject.hypothesis}
        Assumptions: ${activeProject.assumptions.join(', ')}
        
        ${activeProject.fullContent ? `DOCUMENT CONTEXT:
        ${activeProject.fullContent.slice(0, 10000)}` : ''}

        Be rigorous, slightly critical but constructive. Focus on identifying logical fallacies, data gaps, and novelty issues. Use markdown for formatting.`;

        const aiResponseText = await callAI(systemPrompt, newMessages.filter(m => m.id !== 'init'), {
            temperature: 0.7
        });
        
        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: aiResponseText || "Analysis complete. No specific anomalies found.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedMessages = [...newMessages, aiMessage];
        setMessages(updatedMessages);
        
        const extractMetricsPrompt = `
            Based on the following research conversation and the document context, update the research metrics. 
            Analyze for:
            1. Logic Consistency (0.0 to 1.0)
            2. Data Lineage (0.0 to 1.0)
            3. Novelty Index (0.0 to 1.0)
            
            Return ONLY RAW JSON: { "logicConsistency": number, "dataLineage": number, "noveltyIndex": number }
            
            Conversation so far:
            ${updatedMessages.slice(-4).map(m => `${m.role}: ${m.text}`).join('\n')}
        `;

        try {
            const metricsResult = await callAI(extractMetricsPrompt, [], { responseMimeType: 'application/json' });
            const cleanedMetrics = metricsResult.replace(/```json/g, '').replace(/```/g, '').trim();
            const newMetricsData = JSON.parse(cleanedMetrics);
            
            const finalMetrics = {
                ...activeProject.metrics,
                logicConsistency: newMetricsData.logicConsistency ?? activeProject.metrics.logicConsistency,
                dataLineage: newMetricsData.dataLineage ?? activeProject.metrics.dataLineage,
                noveltyIndex: newMetricsData.noveltyIndex ?? activeProject.metrics.noveltyIndex,
                confidence: Math.min(99, activeProject.metrics.confidence + 2)
            };

            updateProject(activeProject.id, { 
                analysisChat: updatedMessages.map(m => ({ role: m.role, text: m.text, timestamp: m.timestamp })),
                metrics: finalMetrics
            });
        } catch (e) {
            console.warn("Metrics update failed:", e);
            updateProject(activeProject.id, { 
                analysisChat: updatedMessages.map(m => ({ role: m.role, text: m.text, timestamp: m.timestamp }))
            });
        }

    } catch (error: any) {
        console.error("AI API Error:", error);

        let errorText = "Connection to Neural Core interrupted. Please verify API configuration.";
        const msg = (error.message || error.toString()).toLowerCase();
        
        if (msg.includes('429')) {
            errorText = "Quota limit reached. Please wait a moment or switch providers in Settings.";
        } else if (msg.includes('401') || msg.includes('403') || msg.includes('key')) {
            errorText = "Authentication failed. Please check your API key in Settings.";
        } else if (msg) {
            errorText = `Error: ${msg.slice(0, 100)}`;
        }

        const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: errorText,
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleDeepScan = async () => {
    if (!activeProject || isScanning) return;

    // Context Awareness Check: Ensure we have enough data to scan
    // REMOVED BLOCKING LOGIC: We will scan whatever we have (Title + Hypothesis is enough for a basic check)
    const hasContent = activeProject.fullContent && activeProject.fullContent.length > 50;
    const hasSpecimens = activeProject.specimens && activeProject.specimens.length > 0;

    // Paper-only mode notification (informational)
    if (!hasSpecimens) {
        // If content is also missing, this might be a very "thin" scan
        if (!hasContent) {
             addLog({ module: 'Analysis', event: 'Running minimal scan (Title/Hypothesis only)...', status: 'warning' });
        } else {
             addLog({ module: 'Analysis', event: 'Running paper-only diagnostic...', status: 'info' });
        }
    }

    setIsScanning(true);
    addLog({ module: 'Analysis', event: 'Initializing Deep Diagnostic Scan...', status: 'info' });

    

    try {
        const isPaperOnly = !activeProject.specimens || activeProject.specimens.length === 0;
        const validContent = activeProject.fullContent || '';

        // Construct the suggestion for the mentor message
        const datasetSuggestion = isPaperOnly ? "\n\n**Suggestion:** For empirical validation of these claims, consider uploading a dataset (e.g., patient records, genomic sequences) to the Specimen Lab." : "";

        const scanPrompt = `
            You are the Lead Diagnostic Engine. Perform a deep technical and logical diagnostic on this research project.
            DO NOT PROVIDE GENERIC FEEDBACK. Use the provided PROJECT CONTENT as the absolute source of truth.

            CONTEXT: ${isPaperOnly ? 'PHASE 1: THEORETICAL VALIDATION (Paper-Only). Focus on methodology coherence, hypothesis logic, and literature novelty. Do NOT block analysis due to missing data.' : 'PHASE 2: EMPIRICAL VALIDATION (Full Spectrum). Analyze consistency between hypothesis and provided specimens.'}

            PROJECT TITLE: ${activeProject.title}
            HYPOTHESIS: ${activeProject.hypothesis}
            ASSUMPTIONS: ${activeProject.assumptions.join(', ')}
            CONTENT: ${validContent.slice(0, 15000)}
            HAS_SPECIMENS: ${!isPaperOnly}

            TASK:
            1. Logic Consistency (0-100): How cohesive is the argument?
            2. Data Lineage (0-100): ${isPaperOnly ? 'Evaluate the METHODOLOGICAL RIGOR of the proposed data strategy. If no data plan is mentioned, score low (20-40). If a solid plan exists, score higher (50-80). Do not return 0.' : 'How well do the specimens support the hypothesis?'}
            3. Novelty Index (0-100): How unique is this compared to standard literature?
            4. Radar Map: 5 technical coordinates (0-100) specifically for this research topic.
            5. Vulnerability Alerts: Identify 3 HIGHLY SPECIFIC logical or technical risks found IN THE CONTENT.
               RETURN AS ARRAY OF OBJECTS: [{ "type": "CRITICAL"|"MODERATE"|"SUGGESTION", "title": "Short Title", "desc": "Specific description", "riskScore": "X/10", "action": "RESOLVE"|"OPTIMIZE"|"SELECT" }]
            6. Mission Protocol: Provide 3 granular, technical Primary Objectives (scopeFocus) and 3 formatted Mission Abort items (scopeAbort).
               RETURN AS ARRAY OF STRINGS: ["TITLE: Description", ...]
            7. Operational Roadmap: Generate 5 specific milestones for THIS project.
               RETURN AS ARRAY OF OBJECTS: [{ "phase": 0-4, "title": "Phase Title", "desc": "Phase Description" }]
            8. Operational Status: Current Phase (0-4).

            Return JSON: { 
                "logic": number, 
                "lineage": number, 
                "novelty": number, 
                "radar": [number, number, number, number, number],
                "vulnerabilities": [{...}, ...],
                "scopeFocus": ["Title: Desc", ...],
                "scopeAbort": ["Title: Desc", ...],
                "roadmap": [{ "phase": 0, "title": "...", "desc": "..." }, ...],
                "currentPhase": number,
                "summary": "2-sentence technical summary of findings. Focus on the validity of the research proposal."
            }
        `;

        const result = await callAI(scanPrompt, [], { responseMimeType: 'application/json' });
        const data = JSON.parse(result);

        updateProject(activeProject.id, {
            metrics: {
                ...activeProject.metrics,
                logicConsistency: data.logic / 100,
                dataLineage: data.lineage / 100,
                noveltyIndex: data.novelty / 100,
                confidence: Math.round((data.logic + data.lineage + data.novelty) / 3),
                radar: data.radar ? data.radar.join(',') : metrics.radar
            },
            vulnerabilities: data.vulnerabilities || [],
            scopeFocus: data.scopeFocus || [],
            scopeAbort: data.scopeAbort || [],
            roadmap: data.roadmap || [],
            progress: data.currentPhase !== undefined ? (data.currentPhase + 1) * 20 : activeProject.progress
        });

        addLog({ module: 'Analysis', event: 'Deep Scan Complete.', status: 'success' });
        
        const aiMsg: Message = {
            id: Date.now().toString(),
            role: 'ai',
            text: (data.summary || `Deep Scan Complete. Diagnostic metrics updated based on your project content.`) + datasetSuggestion,
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, aiMsg]);

    } catch (e) {
        console.error(e);
        addLog({ module: 'Analysis', event: 'Deep Scan Failed.', status: 'error' });
    } finally {
        setIsScanning(false);
    }
  };

  const metrics = activeProject?.metrics || {
      confidence: 0,
      logicConsistency: 0,
      dataLineage: 0,
      noveltyIndex: 0
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col overflow-hidden">
      
      {/* Top Bar - Specialized for Room A */}
      <header className="h-16 border-b border-white/5 bg-slate-950 flex items-center justify-between px-4 md:px-6 z-50">
        <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-indigo-500/20 border border-indigo-500/50 rounded flex items-center justify-center">
                    <Activity className="w-3 h-3 text-indigo-500" />
                </div>
                <h1 className="text-sm font-bold text-white tracking-widest uppercase hidden md:block">Analysis</h1>
                <h1 className="text-sm font-bold text-white tracking-widest uppercase md:hidden">AE</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
                <button onClick={() => onNavigate('specimens')} className="hover:text-white transition-colors">Dataset</button>
                <button onClick={() => onNavigate('library')} className="hover:text-white transition-colors">Library</button>
                <button className="text-white">Analysis</button>
            </nav>
            <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase transition-all ${
                    isChatOpen 
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' 
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
            >
                <ShieldAlert className="w-4 h-4" />
                {isChatOpen ? 'Close Chat' : 'AI Chat'}
            </button>
        </div>

            <div className="flex items-center gap-3 md:gap-4">
                <button 
                    onClick={handleDeepScan}
                    disabled={isScanning}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                        isScanning 
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' 
                        : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/20'
                    }`}
                >
                    <Activity className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? 'Scanning...' : 'Run Diagnostic Scan'}
                </button>
                <button 
                  onClick={() => setIsMobileNavOpen(true)}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white md:hidden"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <ProfileDropdown onNavigate={onNavigate} />
            </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Panel: Fixed Sidebar Chat HUD */}
        <div className={`
            ${isChatOpen ? 'fixed inset-0 z-[60] flex' : 'hidden'} 
            lg:relative lg:flex lg:w-[400px] flex-col border-r border-white/5 bg-slate-950/80 backdrop-blur-xl
        `}>
            {/* Mobile Backdrop */}
            {isChatOpen && (
                <div 
                    className="fixed inset-0 bg-slate-950/60 lg:hidden" 
                    onClick={() => setIsChatOpen(false)}
                />
            )}
            
            <div className="relative flex flex-col w-full h-full bg-slate-950/90 lg:bg-transparent">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Consultation Engine</span>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                            <div className="w-1 h-1 rounded-full bg-indigo-500/40" />
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-white/5 text-slate-500">
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            {/* Consultation Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {activeProject ? (
                    <>
                    {/* Welcome / Initial Analysis - Fixed at top if present */}
                    {messages.length > 0 && (
                        <div className="p-4 border-b border-white/5 bg-slate-900/20">
                            <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                                <ShieldAlert className="w-3 h-3" />
                                Initial Analysis
                            </div>
                            <div className="bg-slate-900 border border-white/10 rounded-xl p-4 text-xs leading-relaxed text-slate-300 shadow-sm">
                                <span dangerouslySetInnerHTML={{ 
                                    __html: messages[0].text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-slate-400">$1</em>').replace(/\n/g, '<br/>')
                                }} />
                            </div>
                        </div>
                    )}

                    {/* Chat Input Area - Repositioned after Initial Analysis */}
                    <div className="p-4 border-b border-white/5 bg-slate-950/50">
                        <form className="relative" onSubmit={handleSendMessage}>
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Request Deep Analysis..."
                                disabled={!activeProject}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-mono"
                            />
                            <button type="submit" className="absolute right-3 top-2.5 p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg text-indigo-500 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Chat Stream - Rest of messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                        {messages.slice(1).map((msg, index) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`space-y-2 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}
                            >
                                {msg.role === 'ai' && (
                                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wide">
                                        <ShieldAlert className="w-3 h-3" />
                                        AI Mentor
                                    </div>
                                )}
                                
                                <div className={`
                                    p-4 text-sm leading-relaxed max-w-[95%] shadow-sm
                                    ${msg.role === 'ai' 
                                        ? 'bg-slate-900 border border-white/10 rounded-xl rounded-tl-none text-slate-300' 
                                        : 'bg-slate-800 border border-white/5 rounded-xl rounded-tr-none text-slate-200'
                                    }
                                `}>
                                    {msg.role === 'ai' ? (
                                        <span dangerouslySetInnerHTML={{ 
                                            __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-slate-400">$1</em>').replace(/\n/g, '<br/>')
                                        }} />
                                    ) : msg.text}
                                </div>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 text-slate-500 text-xs pl-2"
                            >
                                <Loader2 className="w-3 h-3 animate-spin" />
                                AI is thinking...
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                        <AlertTriangle className="w-8 h-8 mb-4 opacity-50" />
                        <p>No active project selected.</p>
                        <button onClick={() => onNavigate('dashboard')} className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm">Return to Dashboard</button>
                    </div>
                )}
            </div>
        </div>
    </div>

        {/* Right Panel: Scrollable Diagnostic HUD */}
        <div className="flex-1 overflow-y-auto bg-slate-950/20 custom-scrollbar relative">
             <div className="relative p-6 lg:p-12 max-w-6xl mx-auto space-y-12">
                 {/* Background Grid */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

             <div className="relative z-10 max-w-5xl mx-auto space-y-8">
                
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm font-medium text-slate-500 relative z-20">
                    <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
                    <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
                    <button onClick={() => onNavigate('new-project')} className="hover:text-white transition-colors">Project</button>
                    <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
                    <span className="text-indigo-500">Analysis</span>
                </nav>

                {/* Header */}
                <div>
                    <div className="flex items-end justify-between border-b border-white/5 pb-4 mb-6">
                        <div className="flex items-end gap-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">DIAGNOSTIC REPORT</h2>
                            {activeProject && (
                                <>
                                    <div className="hidden sm:block pb-1.5 px-2 bg-slate-800/50 border border-white/5 rounded text-[10px] font-mono text-emerald-500 animate-pulse uppercase">
                                        Live Telemetry
                                    </div>
                                    {/* Analysis Mode Indicator */}
                                    {activeProject.specimens && activeProject.specimens.length > 0 ? (
                                        <div className="hidden md:flex items-center gap-1.5 pb-1.5 px-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                            <Database className="w-3 h-3" />
                                            Full Spectrum
                                        </div>
                                    ) : (
                                        <div className="hidden md:flex items-center gap-1.5 pb-1.5 px-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                                            <Shield className="w-3 h-3" />
                                            Document Analysis
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs md:text-sm text-indigo-400 bg-indigo-500/5 border-l-2 border-indigo-500 px-4 py-2">
                         <span className="w-1.5 h-4 bg-indigo-500 inline-block mr-2" />
                         <span className="block">Real-time threat modeling. {activeProject ? <span className="font-bold">SYSTEM ACTIVE</span> : "WAITING FOR INPUT"}</span>
                    </div>
                </div>

                {/* Top Row: Visualizations */}
                <div className="grid lg:grid-cols-5 gap-6">
                    
                    {/* Gauge Card */}
                    <div className="lg:col-span-2 glass-card p-6 rounded-2xl bg-slate-900/40 border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">System Health</h3>
                            <span className={`text-[10px] font-bold uppercase ${metrics.confidence > 50 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                {metrics.confidence > 50 ? 'Stable' : 'Below Par'}
                            </span>
                        </div>
                        <div className="flex items-center justify-center py-4">
                             <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
                                 {/* SVG Gauge */}
                                 <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                     <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                                     <motion.circle 
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: metrics.confidence / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        cx="50" cy="50" r="45" fill="none" stroke={metrics.confidence > 50 ? "#10b981" : "#6366f1"} strokeWidth="8" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                     />
                                 </svg>
                                 <div className="absolute text-center">
                                     <div className="text-4xl md:text-5xl font-bold text-white">{metrics.confidence}<span className="text-2xl text-slate-500">%</span></div>
                                     <div className="text-[10px] font-mono text-slate-500 uppercase mt-1">Global Rigor</div>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Logic Metrics & Radar */}
                    <div className="lg:col-span-3 glass-card p-6 rounded-2xl bg-slate-900/40 border border-white/5 grid md:grid-cols-2 gap-8">
                         <div className="space-y-6">
                             <MetricRow 
                                label="Logic Consistency" 
                                value={metrics.logicConsistency.toFixed(2)} 
                                status={metrics.logicConsistency > 0.7 ? "success" : "warning"} 
                             />
                             <MetricRow 
                                label="Data Lineage" 
                                value={activeProject?.specimens && activeProject.specimens.length > 0 ? metrics.dataLineage.toFixed(2) : "N/A"} 
                                status={activeProject?.specimens && activeProject.specimens.length > 0 ? (metrics.dataLineage > 0.5 ? "warning" : "critical") : "info"}
                                tooltip={activeProject?.specimens && activeProject.specimens.length === 0 ? "Upload datasets in Specimen Lab for empirical validation" : undefined}
                             />
                             <MetricRow 
                                label="Novelty Index" 
                                value={metrics.noveltyIndex.toFixed(2)} 
                                status="critical" 
                             />
                             
                             <div className="h-1 w-12 bg-indigo-500 rounded-full mt-4" />
                         </div>

                          <div className="relative flex items-center justify-center">
                              {/* Dynamic Radar Chart */}
                              <svg viewBox="0 0 100 100" className="w-full h-full max-w-[140px] md:max-w-[180px]">
                                  <polygon points="50,10 88,38 74,82 26,82 12,38" fill="none" stroke="#334155" strokeWidth="1" opacity="0.5" />
                                  <polygon points="50,30 69,44 62,66 38,66 31,44" fill="none" stroke="#334155" strokeWidth="1" opacity="0.3" />
                                  <motion.polygon 
                                     initial={{ scale: 0 }}
                                     animate={{ scale: activeProject ? 1 : 0 }}
                                     points={getRadarPoints(metrics.radar || "50,50,50,50,50")} 
                                     fill="rgba(99, 102, 241, 0.2)" 
                                     stroke="#6366f1" 
                                     strokeWidth="2" 
                                     className="transition-all duration-1000"
                                  />
                              </svg>
                              <div className="absolute -bottom-2 text-[8px] font-mono text-slate-600 uppercase tracking-wider">Multivariate Logic Map</div>
                          </div>
                    </div>
                </div>

                {/* Vulnerability Alerts & Recommendations */}
                <div className="pt-8">
                     <h3 className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                        Vulnerability Alerts & Recommendations
                     </h3>
                     
                     <div className="grid md:grid-cols-3 gap-6">
                        {activeProject?.vulnerabilities && activeProject.vulnerabilities.length > 0 ? (
                            activeProject.vulnerabilities.map((v, i) => (
                                <VulnerabilityCard 
                                    key={i}
                                    type={v.type}
                                    title={v.title}
                                    desc={v.desc}
                                    riskScore={v.riskScore}
                                    action={v.action}
                                    onClick={() => setSelectedVuln(v)}
                                />
                            ))
                        ) : (
                            /* Pending / Empty State */
                            <div className="col-span-3 p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 flex flex-col items-center justify-center text-center">
                                <Activity className="w-8 h-8 text-slate-700 mb-3" />
                                <h4 className="text-slate-500 font-bold text-sm uppercase tracking-wider">Awaiting Diagnostic Scan</h4>
                                <p className="text-slate-600 text-xs mt-2 max-w-xs mx-auto">
                                    Run a detailed analysis to generate vulnerability assessments and threat models.
                                </p>
                            </div>
                        )}
                     </div>
                </div>

                {/* Mission Protocol Section */}
                <div className="pt-12">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div>
                            <h3 className="flex items-center gap-3 text-xs md:text-sm font-mono text-indigo-500 uppercase tracking-[0.4em] font-black mb-2">
                                <Target className="w-4 h-4" />
                                Mission Protocol
                            </h3>
                            <p className="text-sm text-slate-400 font-medium max-w-xl">Strategic objectives and operational guardrails derived from multimodal diagnostic analysis.</p>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-mono text-slate-500 uppercase bg-slate-900/40 border border-white/5 py-2 px-5 rounded-full backdrop-blur-sm self-start md:self-center">
                            <span className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${activeProject?.scopeFocus?.length > 0 ? 'bg-indigo-500' : 'bg-slate-600'} animate-pulse`} /> Sector: Research Delta</span>
                            <div className="w-px h-4 bg-white/10" />
                            <span>Security: Level 5</span>
                        </div>
                     </div>
                     
                     {activeProject?.scopeFocus && activeProject.scopeFocus.length > 0 ? (
                         <div className="grid lg:grid-cols-2 gap-8">
                             {/* Primary Directives (In Scope) */}
                             <div className="glass-card p-1 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
                                 <div className="p-8 space-y-8 bg-slate-950/40 rounded-[22px] h-full">
                                     <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                                            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em] mb-1">Status: Active</div>
                                            <div className="text-xl font-black text-white tracking-tight">Primary Directives</div>
                                        </div>
                                     </div>

                                     <div className="space-y-6">
                                         {activeProject.scopeFocus.map((item, i) => (
                                             <motion.div 
                                                key={i} 
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex gap-6 group/item"
                                             >
                                                 <div className="text-sm font-mono text-emerald-500/30 mt-1 font-bold">0{i+1}</div>
                                                 <div>
                                                    <p className="text-base text-slate-100 font-bold mb-1 group-hover/item:text-emerald-400 transition-colors uppercase tracking-tight">{item.split(':')[0]}</p>
                                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                                        {item.split(':')[1] || "High-priority technical objective validated by diagnostic engine."}
                                                    </p>
                                                 </div>
                                             </motion.div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                             
                             {/* Mission Abort (Out of Scope) */}
                             <div className="glass-card p-1 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
                                 <div className="p-8 space-y-8 bg-slate-950/40 rounded-[22px] h-full">
                                     <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                                            <XCircle className="w-7 h-7 text-indigo-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.2em] mb-1">Status: Restricted</div>
                                            <div className="text-xl font-black text-white tracking-tight">Mission Abort Zone</div>
                                        </div>
                                     </div>

                                     <div className="space-y-6">
                                         {activeProject.scopeAbort.map((item, i) => (
                                             <motion.div 
                                                key={i}
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex gap-6 group/item"
                                             >
                                                 <div className="text-sm font-mono text-indigo-500/30 mt-1 font-bold">E{i}</div>
                                                 <div>
                                                    <p className="text-base text-slate-200 font-bold mb-1 group-hover/item:text-indigo-400 transition-colors uppercase tracking-tight">{item.split(':')[0]}</p>
                                                    <p className="text-xs text-slate-400 leading-relaxed font-mono italic">
                                                        {item.split(':')[1] || "Operational exclusion required to prevent research dead-ends."}
                                                    </p>
                                                 </div>
                                             </motion.div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                         </div>
                     ) : (
                        <div className="w-full h-64 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10 flex flex-col items-center justify-center text-center">
                            <Target className="w-10 h-10 text-slate-700 mb-4 opacity-50" />
                            <h4 className="text-slate-500 font-bold text-sm uppercase tracking-wider">Protocol Not Established</h4>
                            <p className="text-slate-600 text-xs mt-2">Initialize diagnostic scan to generate mission parameters.</p>
                        </div>
                     )}
                </div>

                {/* Research Operational Timeline (Vertical Roadmap) */}
                <div className="pt-24 pb-32 border-t border-white/5 mt-20 relative">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                     
                     <div className="mb-16 text-center">
                        <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.6em] font-black mb-4">Operational Roadmap</h3>
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Synapse to Syntax Protocol</h2>
                        <div className="w-12 h-1 bg-indigo-500 mx-auto mt-6 rounded-full" />
                     </div>
                     
                     <div className="max-w-4xl mx-auto relative px-4 md:px-0">
                         {/* Centered Vertical Line */}
                         <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 h-full w-px bg-slate-800 shadow-[0_0_15px_rgba(99,102,241,0.1)]" />
                         
                         <div className="space-y-16">
                            {activeProject?.roadmap && activeProject.roadmap.length > 0 ? (
                                activeProject.roadmap.map((step, i) => (
                                    <RoadmapStep 
                                        key={i}
                                        phase={step.phase} 
                                        title={step.title} 
                                        desc={step.desc} 
                                        isActive={activeProject.progress >= (step.phase + 1) * 20}
                                        isRight={i % 2 !== 0}
                                        isWarning={step.phase === 4 && activeProject.progress >= 80}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center relative z-10 bg-slate-950">
                                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 animate-pulse">
                                        <Activity className="w-8 h-8 text-slate-700" />
                                    </div>
                                    <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Roadmap Not Generated</h3>
                                    <p className="text-slate-600 text-xs max-w-sm">
                                        Run diagnostic scan to generate a project-specific operational timeline.
                                    </p>
                                </div>
                            )}
                         </div>
                     </div>
                </div>

            </div>
        </div>
    </div>
      {/* Vulnerability Modal */}
      <AnimatePresence>
        {selectedVuln && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={() => setSelectedVuln(null)}
             className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
           >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative overflow-hidden"
              >
                  <div className="absolute top-0 right-0 p-4">
                      <button onClick={() => setSelectedVuln(null)} className="text-slate-500 hover:text-white transition-colors">
                          <XCircle className="w-6 h-6" />
                      </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-xl border ${
                          selectedVuln.type === 'CRITICAL' ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' :
                          selectedVuln.type === 'MODERATE' ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' :
                          'bg-indigo-500/20 border-indigo-500/50 text-indigo-500'
                      }`}>
                          <ShieldAlert className="w-8 h-8" />
                      </div>
                      <div>
                          <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                              selectedVuln.type === 'CRITICAL' ? 'text-rose-400' :
                              selectedVuln.type === 'MODERATE' ? 'text-amber-400' :
                              'text-indigo-400'
                          }`}>{selectedVuln.type} ALERT</h4>
                          <h2 className="text-2xl font-bold text-white">{selectedVuln.title}</h2>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                          <h5 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-2">Description</h5>
                          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                              {selectedVuln.desc}
                          </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <h5 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Risk Score</h5>
                              <p className="text-2xl font-mono font-bold text-white">{selectedVuln.riskScore}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <h5 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Recommended Action</h5>
                              <div className="flex items-center gap-2">
                                  <span className="text-emerald-400 font-bold">{selectedVuln.action}</span>
                                  <ArrowRight className="w-4 h-4 text-emerald-500" />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                      <button 
                        onClick={() => setSelectedVuln(null)}
                        className="px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                      >
                          Acknowledge & Close
                      </button>
                  </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      </main>

      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
        onNavigate={onNavigate}
        currentPage="analysis"
      />
    </div>
  );
};

const getRadarPoints = (radarString: string) => {
    const vals = radarString.split(',').map(v => parseInt(v) || 0);
    if (vals.length < 5) return "50,50 50,50 50,50 50,50 50,50";
    
    // Calculate points based on 5 vertices of a pentagon
    const p1 = `50,${50 - (40 * vals[0] / 100)}`;
    const p2 = `${50 + (38 * vals[1] / 100)},${50 - (12 * vals[1] / 100)}`;
    const p3 = `${50 + (24 * vals[2] / 100)},${50 + (32 * vals[2] / 100)}`;
    const p4 = `${50 - (24 * vals[3] / 100)},${50 + (32 * vals[3] / 100)}`;
    const p5 = `${50 - (38 * vals[4] / 100)},${50 - (12 * vals[4] / 100)}`;
    
    return `${p1} ${p2} ${p3} ${p4} ${p5}`;
};

const VulnerabilityCard = ({ type, title, desc, riskScore, action, onClick }: any) => {
    const isCritical = type === 'CRITICAL';
    const isModerate = type === 'MODERATE';
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className={`p-5 rounded-2xl border transition-all hover:bg-white/[0.02] cursor-pointer group ${
                isCritical ? 'bg-indigo-500/[0.03] border-indigo-500/20 hover:border-indigo-500/40' : 
                isModerate ? 'bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/40' : 
                'bg-cyan-500/[0.03] border-cyan-500/20 hover:border-cyan-500/40'
            }`}
        >
            <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    isCritical ? 'bg-indigo-500/20 text-indigo-400' : 
                    isModerate ? 'bg-amber-500/20 text-amber-400' : 
                    'bg-cyan-500/20 text-cyan-400'
                }`}>
                    {type}
                </span>
                {isCritical ? <Database className="w-3.5 h-3.5 text-slate-600" /> : isModerate ? <Activity className="w-3.5 h-3.5 text-slate-600" /> : <Shield className="w-3.5 h-3.5 text-slate-600" />}
            </div>
            
            <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-wide group-hover:text-indigo-300 transition-colors">{title}</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3 font-mono">
                {desc}
            </p>
            
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                <div className="flex flex-col">
                    <span className="text-[8px] text-slate-500 uppercase font-mono">Risk Impact</span>
                    <span className="text-xs font-bold text-slate-300 font-mono">{riskScore}</span>
                </div>
                <div className={`p-1.5 rounded-lg transition-colors ${
                     isCritical ? 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white' : 
                     isModerate ? 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white' : 
                     'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white'
                }`}>
                    <Maximize2 className="w-3.5 h-3.5" />
                </div>
            </div>
        </motion.div>
    );
};

const RoadmapStep = ({ phase, title, desc, isActive, isRight, isWarning }: any) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative flex items-center w-full ${isRight ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Connection Node */}
            <div className={`absolute left-[5.5px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full border-2 bg-slate-950 transition-all duration-1000 z-10 ${
                isActive ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] scale-125' : 
                'border-white/10'
            }`}>
                 {isActive && <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />}
            </div>
            
            {/* Content Card */}
            <div className={`w-full md:w-[45%] pl-10 md:pl-0 ${isRight ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                <div className={`p-8 rounded-[2rem] bg-slate-900/40 border transition-all duration-500 group ${
                    isActive 
                    ? 'border-indigo-500/30 bg-slate-900/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]' 
                    : 'border-white/5 hover:border-white/10'
                }`}>
                    <div className={`text-[10px] font-mono font-black tracking-[0.3em] mb-3 ${isActive ? 'text-indigo-500' : 'text-slate-600'}`}>
                        PROTOCOL PHASE_0{phase}
                    </div>
                    <h4 className={`text-xl font-black mb-3 tracking-tight ${isActive ? 'text-white' : 'text-slate-500'}`}>{title}</h4>
                    <p className={`text-sm leading-relaxed transition-colors font-medium ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                        {desc}
                    </p>
                    
                    {isActive && (
                        <div className={`mt-6 flex items-center gap-3 ${isRight ? 'justify-end' : ''}`}>
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="w-2 h-2 rounded-full bg-indigo-500/40" />
                                <span className="w-2 h-2 rounded-full bg-indigo-500/10" />
                            </div>
                            <span className="text-[10px] font-mono text-indigo-500 font-bold uppercase tracking-widest">Active Link</span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="hidden md:block w-px md:flex-1" />
        </motion.div>
    );
};

// --- Sub-components ---

const MetricRow = ({ label, value, status, tooltip }: { label: string, value: string, status: 'success' | 'warning' | 'critical' | 'info', tooltip?: string }) => {
    // Check if value indicates a pending state (e.g. "0.00" or "0")
    // Also consider N/A in info status as potentially pending/empty
    const isPending = value === "0.00" || value === "0";
    
    const colors = {
        success: 'text-cyan-400',
        warning: 'text-amber-400',
        critical: 'text-indigo-500',
        info: 'text-slate-500'
    };
    const icons = {
        success: CheckCircle2,
        warning: AlertTriangle,
        critical: XCircle,
        info: AlertTriangle 
    };
    
    // Override status visuals if it looks like we're waiting for a scan (and not explicitly N/A)
    const effectiveStatus = (isPending && status !== 'info') ? 'info' : status;
    const displayValue = (isPending && status !== 'info') ? "--" : value;
    
    const Icon = icons[effectiveStatus];

    return (
        <div className="flex items-center justify-between text-sm group" title={tooltip}>
            <span className="text-slate-400 group-hover:text-white transition-colors">{label}</span>
            <div className="flex items-center gap-3">
                <span className={`font-mono font-bold ${colors[effectiveStatus]}`}>{displayValue}</span>
                <Icon className={`w-3 h-3 ${colors[effectiveStatus]}`} />
            </div>
        </div>
    )
}


const FlowStep = ({ label, status }: { label: string, status: 'success' | 'warning' | 'critical' | 'locked' }) => {
    const styles = {
        success: { bg: 'bg-slate-900', border: 'border-cyan-500', icon: CheckCircle2, color: 'text-cyan-500' },
        warning: { bg: 'bg-slate-900', border: 'border-amber-500', icon: AlertTriangle, color: 'text-amber-500' },
        critical: { bg: 'bg-slate-900', border: 'border-indigo-500', icon: XCircle, color: 'text-indigo-500' },
        locked: { bg: 'bg-slate-950', border: 'border-slate-800', icon: null, color: 'text-slate-600' }
    };
    const style = styles[status];
    const Icon = style.icon;

    return (
        <div className="flex flex-col items-center gap-3 bg-slate-950 px-4">
            <div className={`w-8 h-8 rounded-full ${style.bg} border ${style.border} flex items-center justify-center`}>
                {Icon ? <Icon className={`w-4 h-4 ${style.color}`} /> : <div className="w-2 h-3 border border-slate-700 border-t-0 border-r-0" />}
            </div>
            <span className={`text-[10px] font-mono uppercase tracking-wide ${status === 'locked' ? 'text-slate-600' : 'text-slate-400'}`}>
                {label}
            </span>
        </div>
    )
}