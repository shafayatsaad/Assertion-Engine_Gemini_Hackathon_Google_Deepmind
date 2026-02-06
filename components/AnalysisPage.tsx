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
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext';
import { GoogleGenAI } from "@google/genai";
import { ProfileDropdown } from './ProfileDropdown';

interface AnalysisPageProps {
  onNavigate: (page: 'dashboard' | 'library' | 'specimen-lab' | 'profile' | 'new-project' | 'novelty') => void;
}

interface Message {
    id: string;
    role: 'ai' | 'user';
    text: string;
    timestamp: string;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ onNavigate }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getActiveProject, updateProject, user } = useApp();
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
    if (!input.trim() || !activeProject) return;

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
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemPrompt = `You are an advanced academic research validator AI named "Assertion Engine". 
        Your goal is to stress-test the user's research hypothesis. 
        Current Project Title: ${activeProject.title}
        Current Hypothesis: ${activeProject.hypothesis}
        Assumptions: ${activeProject.assumptions.join(', ')}
        
        Be rigorous, slightly critical but constructive. Focus on identifying logical fallacies, data gaps, and novelty issues. Use markdown for formatting.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: [
                { role: 'user', parts: [{ text: systemPrompt }] }, 
                ...newMessages.filter(m => m.id !== 'init').map(m => ({
                    role: m.role === 'ai' ? 'model' : 'user',
                    parts: [{ text: m.text }]
                }))
            ],
            config: {
                temperature: 0.7,
            }
        });

        const aiResponseText = response.text || "Analysis complete. No specific anomalies found.";
        
        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: aiResponseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedMessages = [...newMessages, aiMessage];
        setMessages(updatedMessages);
        
        // Also simulate updating metrics based on conversation depth (simplified simulation)
        if (updatedMessages.length > 3) {
             const newMetrics = {
                 ...activeProject.metrics,
                 logicConsistency: Math.min(0.98, activeProject.metrics.logicConsistency + 0.05),
                 confidence: Math.min(99, activeProject.metrics.confidence + 5)
             };
             updateProject(activeProject.id, { 
                analysisChat: updatedMessages.map(m => ({ role: m.role, text: m.text, timestamp: m.timestamp })),
                metrics: newMetrics
            });
        } else {
             updateProject(activeProject.id, { 
                analysisChat: updatedMessages.map(m => ({ role: m.role, text: m.text, timestamp: m.timestamp }))
            });
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: "Connection to Neural Core interrupted. Please verify API configuration.",
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsTyping(false);
    }
  };

  const metrics = activeProject?.metrics || {
      confidence: 0,
      logicConsistency: 0,
      dataLineage: 0,
      noveltyIndex: 0
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-rose-500/30 selection:text-rose-200 flex flex-col overflow-hidden">
      
      {/* Top Bar - Specialized for Room A */}
      <header className="h-16 border-b border-white/5 bg-slate-950 flex items-center justify-between px-4 md:px-6 z-50">
        <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-rose-500/20 border border-rose-500/50 rounded flex items-center justify-center">
                    <Activity className="w-3 h-3 text-rose-500" />
                </div>
                <h1 className="text-sm font-bold text-white tracking-widest uppercase hidden md:block">Analysis</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
                <button onClick={() => onNavigate('library')} className="hover:text-white transition-colors">Library</button>
                <button className="text-white">Analysis</button>
                <button onClick={() => onNavigate('novelty')} className="hover:text-white transition-colors">Novelty</button>
                <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">Settings</button>
            </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide hidden sm:inline-block">Vulnerability Scanner Active</span>
            </div>
            <ProfileDropdown onNavigate={onNavigate} />
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Panel: The Chat Interface */}
        <div className="w-full lg:w-96 h-[45vh] lg:h-auto border-b lg:border-b-0 lg:border-r border-white/5 bg-slate-950/50 flex flex-col z-10">
            {/* Toolbar */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-4">
                <div className="flex gap-2">
                    <button className="text-[10px] font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                        MENTOR MODE
                    </button>
                </div>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {activeProject ? (
                    <>
                    {messages.map((msg, index) => (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`space-y-2 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}
                        >
                            {msg.role === 'ai' && (
                                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wide">
                                    <ShieldAlert className="w-3 h-3" />
                                    {index === 0 ? "Initial Analysis" : "AI Mentor"}
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
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                        <AlertTriangle className="w-8 h-8 mb-4 opacity-50" />
                        <p>No active project selected.</p>
                        <button onClick={() => onNavigate('dashboard')} className="mt-4 text-rose-400 hover:text-rose-300 text-sm">Return to Dashboard</button>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-slate-950">
                <form className="relative" onSubmit={handleSendMessage}>
                    <button type="button" className="absolute left-3 top-3 text-slate-500 hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={activeProject ? "Request analysis..." : "Create a project first..."}
                        disabled={!activeProject}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-10 pr-12 py-3 text-sm text-slate-300 focus:outline-none focus:border-rose-500/50 transition-all font-mono disabled:opacity-50"
                    />
                    <button type="submit" disabled={!activeProject || !input.trim()} className="absolute right-2 top-2 p-1.5 bg-rose-500 hover:bg-rose-400 rounded-md text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>

        {/* Right Panel: HUD - Takes remaining space */}
        <div className="flex-1 bg-slate-950 p-6 lg:p-10 overflow-y-auto relative h-[55vh] lg:h-auto">
             {/* Background Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

             <div className="relative z-10 max-w-5xl mx-auto space-y-8">
                
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm font-medium text-slate-500">
                    <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
                    <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
                    <button onClick={() => onNavigate('new-project')} className="hover:text-white transition-colors">Project</button>
                    <ChevronRight className="w-4 h-4 mx-2 text-slate-700" />
                    <span className="text-rose-500">Analysis</span>
                </nav>

                {/* Header */}
                <div>
                    <div className="flex items-end justify-between border-b border-white/5 pb-4 mb-6">
                        <div className="flex items-end gap-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">DIAGNOSTIC REPORT</h2>
                            {activeProject && (
                                <div className="hidden sm:block pb-1.5 px-2 bg-slate-800/50 border border-white/5 rounded text-[10px] font-mono text-emerald-500 animate-pulse uppercase">
                                    Live Telemetry
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs md:text-sm text-rose-400 bg-rose-500/5 border-l-2 border-rose-500 px-4 py-2">
                         <span className="w-1.5 h-4 bg-rose-500 inline-block mr-2" />
                         <span className="block">Real-time threat modeling. {activeProject ? <span className="font-bold">SYSTEM ACTIVE</span> : "WAITING FOR INPUT"}</span>
                    </div>
                </div>

                {/* Top Row: Visualizations */}
                <div className="grid lg:grid-cols-5 gap-6">
                    
                    {/* Gauge Card */}
                    <div className="lg:col-span-2 glass-card p-6 rounded-2xl bg-slate-900/40 border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">System Health</h3>
                            <span className={`text-[10px] font-bold uppercase ${metrics.confidence > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
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
                                        cx="50" cy="50" r="45" fill="none" stroke={metrics.confidence > 50 ? "#10b981" : "#f43f5e"} strokeWidth="8" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]"
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
                                value={metrics.dataLineage.toFixed(2)} 
                                status={metrics.dataLineage > 0.5 ? "warning" : "critical"} 
                             />
                             <MetricRow 
                                label="Novelty Index" 
                                value={metrics.noveltyIndex.toFixed(2)} 
                                status="critical" 
                             />
                             
                             <div className="h-1 w-12 bg-rose-500 rounded-full mt-4" />
                         </div>

                         <div className="relative flex items-center justify-center">
                             {/* Mock Radar Chart */}
                             <svg viewBox="0 0 100 100" className="w-full h-full max-w-[140px] md:max-w-[180px]">
                                 <polygon points="50,10 90,40 80,90 20,90 10,40" fill="none" stroke="#334155" strokeWidth="1" />
                                 <polygon points="50,25 75,45 70,80 30,80 25,45" fill="none" stroke="#334155" strokeWidth="1" />
                                 <motion.polygon 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: activeProject ? 1 : 0 }}
                                    points="50,15 85,42 60,85 35,60 25,42" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="2" 
                                 />
                             </svg>
                             <div className="absolute -bottom-2 text-[8px] font-mono text-slate-600 uppercase tracking-wider">Multivariate Logic Map</div>
                         </div>
                    </div>
                </div>

                {/* Bottom Logic Flow */}
                <div className="border-t border-white/5 pt-8">
                     <h3 className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">
                        <LayoutGrid className="w-3 h-3" />
                        Methodology Logic Flow
                     </h3>
                     
                     <div className="relative overflow-x-auto pb-4">
                         {/* Line - Hidden on small mobile if scrolling */}
                         <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10 min-w-[600px]" />
                         
                         <div className="flex justify-between text-center min-w-[600px]">
                             <FlowStep label="Hypothesis" status={activeProject ? "success" : "locked"} />
                             <FlowStep label="Sample Group" status={activeProject?.specimens.length ? "warning" : "locked"} />
                             <FlowStep label="Induction" status="critical" />
                             <FlowStep label="Conclusion" status="locked" />
                         </div>
                     </div>
                </div>

             </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub-components ---

const MetricRow = ({ label, value, status }: { label: string, value: string, status: 'success' | 'warning' | 'critical' }) => {
    const colors = {
        success: 'text-cyan-400',
        warning: 'text-amber-400',
        critical: 'text-rose-500'
    };
    const icons = {
        success: CheckCircle2,
        warning: AlertTriangle,
        critical: XCircle
    };
    const Icon = icons[status];

    return (
        <div className="flex items-center justify-between text-sm group">
            <span className="text-slate-400 group-hover:text-white transition-colors">{label}</span>
            <div className="flex items-center gap-3">
                <span className={`font-mono font-bold ${colors[status]}`}>{value}</span>
                <Icon className={`w-3 h-3 ${colors[status]}`} />
            </div>
        </div>
    )
}

const FlowStep = ({ label, status }: { label: string, status: 'success' | 'warning' | 'critical' | 'locked' }) => {
    const styles = {
        success: { bg: 'bg-slate-900', border: 'border-cyan-500', icon: CheckCircle2, color: 'text-cyan-500' },
        warning: { bg: 'bg-slate-900', border: 'border-amber-500', icon: AlertTriangle, color: 'text-amber-500' },
        critical: { bg: 'bg-slate-900', border: 'border-rose-500', icon: XCircle, color: 'text-rose-500' },
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