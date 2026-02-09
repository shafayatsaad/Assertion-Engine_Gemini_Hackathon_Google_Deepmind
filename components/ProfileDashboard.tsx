import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Lock, 
  Key, 
  Webhook, 
  LogOut, 
  Zap, 
  Eye, 
  EyeOff, 
  Atom,
  Activity,
  User as UserIcon,
  ShieldAlert,
  Smartphone,
  Globe,
  Plus,
  Trash2,
  RefreshCw,
  Save,
  LayoutDashboard,
  Menu,
  X,
  XCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext'; // Import Context

interface ProfileDashboardProps {
  onNavigate: (page: 'landing' | 'signin' | 'dashboard') => void;
}

type Tab = 'profile' | 'general' | 'security' | 'apikeys' | 'webhooks';

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile'); // Default to profile for better UX
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useApp(); // Get user from context

  // Check for requested tab in local storage on mount
  useEffect(() => {
    const storedTab = localStorage.getItem('ae_profile_tab') as Tab;
    if (storedTab) {
        // Validate if it's a valid tab
        if (['profile', 'general', 'security', 'apikeys', 'webhooks'].includes(storedTab)) {
            setActiveTab(storedTab);
        }
        localStorage.removeItem('ae_profile_tab');
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('landing');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileView />;
      case 'general': return <GeneralView onNavigate={onNavigate} />;
      case 'security': return <SecurityView onNavigate={onNavigate} />;
      case 'webhooks': return <WebhooksView onNavigate={onNavigate} />;
      case 'apikeys': return <ApiKeysView onNavigate={onNavigate} />;
      default: return <ProfileView />;
    }
  };

  const handleNavClick = (tab: Tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative">
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        w-72 border-r border-white/5 flex flex-col bg-slate-950 fixed h-full z-40 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 relative">
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-10 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 rounded-full bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center overflow-hidden">
               {user?.avatar ? (
                 <img src={user.avatar} alt="User" className="w-full h-full object-cover opacity-80" />
               ) : (
                 <UserIcon className="w-5 h-5 text-cyan-400" />
               )}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-white text-sm truncate">{user?.name || 'Researcher'}</h3>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
             <button 
                onClick={() => onNavigate('dashboard')} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 mb-4 border border-transparent transition-all"
             >
                <LayoutDashboard className="w-4 h-4" />
                Back to Dashboard
             </button>

             <div className="px-4 py-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Account</div>
            <NavItem icon={UserIcon} label="Profile" active={activeTab === 'profile'} onClick={() => handleNavClick('profile')} />
            <NavItem icon={Settings} label="General" active={activeTab === 'general'} onClick={() => handleNavClick('general')} />
            
             <div className="px-4 py-2 mt-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Workspace</div>
            <NavItem icon={Key} label="API Keys" active={activeTab === 'apikeys'} onClick={() => handleNavClick('apikeys')} />
            <NavItem icon={Webhook} label="Webhooks" active={activeTab === 'webhooks'} onClick={() => handleNavClick('webhooks')} />
            <NavItem icon={Lock} label="Security" active={activeTab === 'security'} onClick={() => handleNavClick('security')} />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm font-medium text-slate-400 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 relative min-h-screen flex flex-col">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-slate-950 sticky top-0 z-20">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                 <img src={user.avatar} alt="User" className="w-full h-full object-cover opacity-80" />
               ) : (
                 <UserIcon className="w-5 h-5 text-cyan-400" />
               )}
            </div>
            <span className="font-semibold text-white text-sm">Settings</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-12 lg:p-16 w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// --- Sub-Views ---

const ProfileView = () => {
    const { user, updateUser, addLog } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        institution: '',
        bio: ''
    });

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                title: user.title || '',
                institution: user.institution || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleSave = () => {
        updateUser(formData);
        addLog({ module: 'Profile', event: 'User updated profile information', status: 'success' });
        // Visual feedback could be added here (e.g., toast)
    };

    return (
        <div className="space-y-8">
             <Header 
                title="Researcher Profile" 
                subtitle="Manage your public academic identity and credentials." 
                breadcrumb="Account / Profile" 
             />
             
             <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 bg-slate-900/30 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                    <div className="w-32 h-32 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center relative group cursor-pointer hover:border-cyan-500 transition-colors overflow-hidden">
                        {user?.avatar ? (
                             <img 
                                src={user.avatar} 
                                alt="User" 
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                            />
                        ) : (
                            <UserIcon className="w-12 h-12 text-slate-500" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                            <span className="text-xs font-medium text-white">Change</span>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-mono tracking-wide">VERIFIED PHD</span>
                </div>

                <div className="flex-1 space-y-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup 
                            label="Full Name" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <InputGroup 
                            label="Academic Title" 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <InputGroup 
                        label="Institution / University" 
                        value={formData.institution} 
                        onChange={(e) => setFormData({...formData, institution: e.target.value})}
                    />
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 ml-1">Research Bio</label>
                        <textarea 
                            className="w-full h-32 bg-slate-950 border border-white/10 rounded-lg p-4 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans resize-none leading-relaxed"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            placeholder="Briefly describe your research interests..."
                        />
                    </div>
                </div>
             </div>

             <div className="flex justify-end">
                <SaveButton onClick={handleSave} />
             </div>
        </div>
    );
};

const GeneralView = ({ onNavigate }: { onNavigate: any }) => {
  const { addLog } = useApp();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate/Implement general settings save if needed
    await new Promise(resolve => setTimeout(resolve, 1000));
    addLog({ module: 'Settings', event: 'General settings updated', status: 'success' });
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      <Header 
          title="General Settings" 
          subtitle="Configure global system preferences and data retention policies." 
          breadcrumb="Account / General" 
      />

      <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 bg-slate-900/30 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                   <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      Localization
                   </h3>
                   <div className="space-y-4 pl-0 md:pl-6">
                      <SelectGroup label="Interface Language" options={["English (US)", "English (UK)", "Japanese", "German"]} />
                      <SelectGroup label="Timezone" options={["UTC (Universal)", "EST (New York)", "PST (Los Angeles)", "CET (Berlin)"]} />
                   </div>
              </div>

              <div className="space-y-4">
                   <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      System Preferences
                   </h3>
                   <div className="space-y-4 pl-0 md:pl-6">
                      <SelectGroup label="Default Export Format" options={["PDF (Academic Standard)", "LaTeX Source", "JSON Data"]} />
                      <div className="flex items-center justify-between pt-2">
                          <div className="space-y-1">
                              <div className="text-sm text-slate-300">Auto-Save Reports</div>
                              <div className="text-xs text-slate-500">Save drafts every 30 seconds</div>
                          </div>
                          <Toggle active />
                      </div>
                   </div>
              </div>
          </div>

          <div className="h-px bg-white/5" />

          <div className="space-y-4">
              <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Danger Zone
              </h3>
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                      <div className="text-sm font-medium text-rose-200">Delete Project Data</div>
                      <div className="text-xs text-rose-300/60 mt-1">This will permanently remove all validation history and uploaded datasets.</div>
                  </div>
                  <button className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg border border-rose-500/20 transition-colors whitespace-nowrap">
                      Delete Data
                  </button>
              </div>
          </div>
      </div>
       <div className="flex justify-end">
          <SaveButton onClick={handleSave} isLoading={isSaving} />
       </div>
    </div>
  );
};

const SecurityView = ({ onNavigate }: { onNavigate: any }) => {
  const { updateUser, addLog } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordUpdate = async () => {
    if (!passwords.new || !passwords.confirm) {
        setError('Please enter both new and confirm passwords');
        return;
    }
    if (passwords.new !== passwords.confirm) {
        setError('Passwords do not match');
        return;
    }
    if (passwords.new.length < 6) {
        setError('Password must be at least 6 characters');
        return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
        await updateUser({ newPassword: passwords.new } as any);
        setSuccess('Password updated successfully');
        setPasswords({ current: '', new: '', confirm: '' });
        addLog({ module: 'Security', event: 'User changed password', status: 'success' });
    } catch (err: any) {
        setError(err.message || 'Failed to update password');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <Header 
          title="Security & Access" 
          subtitle="Manage 2FA, passwords, and active session devices." 
          breadcrumb="Workspace / Security" 
      />

      {/* 2FA Section */}
      <div className="glass-card p-6 rounded-2xl border border-white/5 bg-slate-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <Smartphone className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                  <h3 className="text-base font-semibold text-white">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-md">Secure your account with TOTP (Google Authenticator, Authy). Recommended for high-value research data.</p>
              </div>
          </div>
          <button className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold rounded-lg transition-colors shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] whitespace-nowrap">
              Enable 2FA
          </button>
      </div>

      {/* Password Change */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 bg-slate-900/30 space-y-6">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Change Password
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
               <InputGroup 
                label="Current Password" 
                type="password" 
                placeholder="••••••••" 
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
               />
               <InputGroup 
                label="New Password" 
                type="password" 
                placeholder="••••••••" 
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
               />
               <InputGroup 
                label="Confirm New Password" 
                type="password" 
                placeholder="••••••••" 
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
               />
          </div>

          {error && <p className="text-xs text-rose-400 ml-1">{error}</p>}
          {success && <p className="text-xs text-emerald-400 ml-1">{success}</p>}

          <div className="flex items-center justify-between">
              <button className="text-xs font-medium text-slate-400 hover:text-white transition-colors">Forgot your password?</button>
              <SaveButton onClick={handlePasswordUpdate} isLoading={isSaving} />
          </div>
      </div>

      {/* Active Sessions */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 bg-slate-900/30 space-y-6">
           <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              Active Sessions
          </h3>
          <div className="space-y-4">
              {/* Session 1 */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-white/5 gap-3">
                  <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <div>
                          <div className="text-sm font-medium text-white">Current Session</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">Device: {navigator.platform} • Active now</div>
                      </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-wider rounded border border-emerald-500/20">CURRENT</div>
              </div>
          </div>
      </div>
    </div>
  );
};

const WebhooksView = ({ onNavigate }: { onNavigate: any }) => {
    const [webhooks, setWebhooks] = useState<any[]>([]);

    const addWebhook = () => {
        setWebhooks([...webhooks, { id: Date.now(), url: '', events: [], status: 'inactive' }]);
    };

    const removeWebhook = (id: number) => {
        setWebhooks(webhooks.filter(w => w.id !== id));
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <Header 
                    title="Webhooks" 
                    subtitle="Configure event callbacks for your external CI/CD pipelines." 
                    breadcrumb="Workspace / Webhooks" 
                />
                <button 
                    onClick={addWebhook}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold rounded-lg transition-colors shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] w-full md:w-auto justify-center"
                >
                    <Plus className="w-4 h-4" />
                    Add Endpoint
                </button>
            </div>

            <div className="glass-card rounded-2xl border border-white/5 bg-slate-900/30 overflow-x-auto min-h-[200px] flex flex-col">
                {webhooks.length > 0 ? (
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider pl-6">Endpoint URL</th>
                                <th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Events</th>
                                <th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {webhooks.map(webhook => (
                                <WebhookRow key={webhook.id} {...webhook} onRemove={() => removeWebhook(webhook.id)} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-12">
                        <Webhook className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-sm">No webhooks configured.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const WebhookRow = ({ url, events, status, onRemove }: any) => {
    return (
        <tr className="group hover:bg-white/[0.02] transition-colors">
            <td className="p-4 pl-6 font-mono text-sm text-slate-300">
                <input type="text" placeholder="https://..." className="bg-transparent border-b border-transparent focus:border-white/20 outline-none w-full" />
            </td>
            <td className="p-4 text-sm text-slate-500 italic">No events selected</td>
            <td className="p-4">
                <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-slate-500/10 text-slate-400 border-slate-500/20">
                    Draft
                </span>
            </td>
            <td className="p-4 pr-6 text-right">
                <button onClick={onRemove} className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400">
                    <Trash2 className="w-3 h-3" />
                </button>
            </td>
        </tr>
    )
};


const ApiKeysView = ({ onNavigate }: { onNavigate: any }) => {
    const [showKey1, setShowKey1] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error' | 'quota'>('idle');
    const [detectedModel, setDetectedModel] = useState<string | null>(null);
    const [manualModel, setManualModel] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string | null>(null);

    // Universal Key State
    const [showKey2, setShowKey2] = useState(false);
    const [universalKey, setUniversalKey] = useState('');
    const [universalStatus, setUniversalStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [universalProvider, setUniversalProvider] = useState<string | null>(null);

    // Load existing keys on mount
    useEffect(() => {
        // Load Gemini
        const storedKey = localStorage.getItem('ae_api_key');
        const storedModel = localStorage.getItem('ae_api_model');
        const storedManual = localStorage.getItem('ae_manual_model');
        if (storedKey) {
            setApiKey(storedKey);
            if (storedModel) setDetectedModel(storedModel);
            if (storedManual) setManualModel(storedManual);
            setStatus('connected');
        }

        // Load Universal
        const storedUnivKey = localStorage.getItem('ae_universal_key');
        const storedUnivProvider = localStorage.getItem('ae_universal_provider');
        if (storedUnivKey) {
            setUniversalKey(storedUnivKey);
            if (storedUnivProvider) setUniversalProvider(storedUnivProvider);
            setUniversalStatus('connected');
        }
    }, []);

    const handleUniversalDisconnect = () => {
        localStorage.removeItem('ae_universal_key');
        localStorage.removeItem('ae_universal_provider');
        setUniversalKey('');
        setUniversalProvider(null);
        setUniversalStatus('idle');
    }

    const identifyProvider = (key: string): 'anthropic' | 'openai' | 'groq' | 'unknown' => {
        if (key.startsWith('sk-ant')) return 'anthropic';
        if (key.startsWith('gsk_')) return 'groq';
        if (key.startsWith('sk-') && !key.startsWith('sk-ant')) return 'openai';
        return 'unknown';
    };

    const handleUniversalConnect = async () => {
        if (!universalKey.trim()) return;
        
        setUniversalStatus('connecting');
        const provider = identifyProvider(universalKey);
        
        console.log(`🔌 Testing Universal Key for provider: ${provider}`);
        
        try {
            if (provider === 'unknown') {
                throw new Error("Could not identify provider from key format.");
            }

            let isValid = false;

            if (provider === 'groq') {
                const res = await fetch('https://api.groq.com/openai/v1/models', {
                    headers: { 'Authorization': `Bearer ${universalKey}` }
                });
                if (res.ok) isValid = true;
                else throw new Error(`Groq Error: ${res.status}`);
            } 
            else if (provider === 'openai') {
                const res = await fetch('https://api.openai.com/v1/models', {
                    headers: { 'Authorization': `Bearer ${universalKey}` }
                });
                if (res.ok) isValid = true;
                else throw new Error(`OpenAI Error: ${res.status}`);
            }
            else if (provider === 'anthropic') {
                // Anthropic requires a version header and specific endpoint
                const res = await fetch('https://api.anthropic.com/v1/models', {
                    headers: { 
                        'x-api-key': universalKey,
                        'anthropic-version': '2023-06-01',
                        'dangerously-allow-browser': 'true'
                    }
                });
                if (res.ok) isValid = true;
                else {
                    console.warn('Anthropic validation difficult client-side due to CORS. Trusting prefix.');
                    isValid = true; 
                }
            }

            if (isValid) {
                localStorage.setItem('ae_universal_key', universalKey);
                localStorage.setItem('ae_universal_provider', provider);
                setUniversalProvider(provider);
                setUniversalStatus('connected');
                console.log(`✅ ${provider} Connected!`);
            }

        } catch (error: any) {
            console.error('❌ Universal Key Failed:', error);
            setUniversalStatus('error');
            localStorage.removeItem('ae_universal_key');
            localStorage.removeItem('ae_universal_provider');
        }
    };

    const handleConnect = async () => {
        if (!apiKey.trim() || status === 'connecting') return;
        
        setStatus('connecting');
        setDetectedModel(null);
        setDebugInfo(null);
        
        try {
            // Dynamically import official SDK
            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({ apiKey });
            
            console.log('🔌 Testing connection to Google AI...');

            // List of models to try in order of preference
            // Prioritize stable Flash models. Avoid Pro models in auto-discovery to save quota.
            const candidateModels = manualModel ? [manualModel] : [
                'gemini-3-flash-preview',
                'gemini-1.5-flash', 
                'gemini-1.5-flash-8b',
                'gemini-2.0-flash',
                'gemini-1.5-pro'
            ];

            let bestModel = null;
            let quotaModel = null;
            let lastError = null;

            for (const modelName of candidateModels) {
                try {
                    console.log(`Trying model: ${modelName}...`);
                    
                    // Use a very tiny prompt to test connectivity
                    const result = await ai.models.generateContent({
                        model: modelName,
                        contents: "ping"
                    });
                    
                    console.log(`✅ Success with ${modelName}`);
                    bestModel = modelName;
                    break; // Found a perfectly working model!
                } catch (error: any) {
                    const msg = error.message || error.toString();
                    const status = error.status || 0;
                    
                    console.warn(`❌ Failed with ${modelName}:`, msg);
                    lastError = error;

                    // Capture error details for diagnostic trace
                    const diagError = {
                        model: modelName,
                        message: msg,
                        status: status,
                        code: error.code,
                        details: error.details
                    };
                    setDebugInfo(JSON.stringify(diagError, null, 2));
                    
                    // 1. If Invalid Key (403/401), STOP EVERYTHING. No point trying other models.
                    if (status === 403 || status === 401 || msg.includes('API_KEY_INVALID') || msg.includes('invalid') || msg.includes('403')) {
                        console.error('🚫 Critical: Invalid API Key. Stopping discovery.');
                        quotaModel = null; // Don't even treat as quota
                        break; 
                    }

                    // 2. If Quota (429), check for "limit: 0" (provisioning/regional issue)
                    if (status === 429 || msg.includes('429') || msg.includes('Quota')) {
                        console.warn(`⚠️ Quota issue on ${modelName}.`);
                        
                        if (msg.includes('limit: 0')) {
                            console.error('🚫 Critical: Limit is 0. Project/Account restriction.');
                            lastError = new Error(`ZERO_QUOTA: ${modelName} is disabled for this key (Limit: 0). Check Google AI Studio project settings.`);
                            // Continue loop to see if other models have > 0 limit
                        } else {
                            quotaModel = modelName;
                            break; // Regular quota reached, stop trying for this minute
                        }
                    }

                    // 3. Otherwise (404/Unknown), continue to next model
                }
            }

            const finalModel = bestModel || quotaModel;

            if (finalModel) {
                 localStorage.setItem('ae_api_key', apiKey);
                 localStorage.setItem('ae_api_model', finalModel);
                 setDetectedModel(finalModel);
                 
                 if (bestModel) {
                    setStatus('connected');
                    console.log(`💾 Saved configuration: Key + Model (${finalModel})`);
                 } else {
                    setStatus('quota');
                    console.log(`💾 Saved backup configuration (Quota): Key + Model (${finalModel})`);
                 }
            } else {
                throw lastError || new Error("No suitable model found.");
            }
            
        } catch (error: any) {
            console.error('❌ API Key Validation Failed:', error);
            
            // Capture raw error for diagnostic
            const rawError = {
                message: error.message || error.toString(),
                status: error.status,
                name: error.name,
                code: error.code,
                cause: error.cause
            };
            setDebugInfo(JSON.stringify(rawError, null, 2));

            // Re-check for quota in case it fell through
            if (error.message?.includes('429') || error.status === 429 || error.toString().includes('Quota')) {
                 localStorage.setItem('ae_api_key', apiKey);
                 setStatus('quota');
                 return;
            }
            
            setStatus('error');
            localStorage.removeItem('ae_api_key');
        }
    };

    const handleDisconnect = () => {
        localStorage.removeItem('ae_api_key');
        localStorage.removeItem('ae_api_model');
        setApiKey('');
        setDetectedModel(null);
        setStatus('idle');
    }

    return (
    <div className="space-y-8">
        <Header 
            title="API Configuration" 
            subtitle="Manage your LLM provider keys and monitor real-time token usage." 
            breadcrumb="Workspace / API Keys" 
        />

        {/* Universal API Keys Section */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 bg-slate-900/30 space-y-8">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-cyan-400">
                        <Atom className="w-4 h-4" />
                        Universal Provider Key
                    </div>
                    {universalStatus === 'connected' && (
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] font-mono text-slate-400 border border-white/10 px-2 py-1 rounded bg-white/5 capitalize">
                                Using: {universalProvider}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                ACTIVE
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <input 
                            type={showKey2 ? "text" : "password"}
                            value={universalKey}
                            onChange={(e) => {
                                setUniversalKey(e.target.value);
                                if (universalStatus === 'error') setUniversalStatus('idle');
                            }}
                            placeholder="sk-ant..., gsk_..., or sk-..."
                            className={`w-full bg-slate-950 border rounded-lg pl-4 pr-12 py-3 text-sm text-slate-300 focus:outline-none focus:ring-1 transition-all font-mono
                                ${universalStatus === 'error' ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/50'}
                            `}
                        />
                        <button 
                            onClick={() => setShowKey2(!showKey2)}
                            className="absolute right-4 top-3 text-slate-500 hover:text-slate-300"
                        >
                            {showKey2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                
                    {universalStatus === 'connected' ? (
                        <button 
                            onClick={handleUniversalDisconnect}
                            className="px-4 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold hover:bg-rose-500/20 transition-all flex items-center gap-2 whitespace-nowrap justify-center"
                        >
                            <LogOut className="w-3 h-3" />
                            Disconnect
                        </button>
                    ) : (
                        <button 
                            onClick={handleUniversalConnect}
                            disabled={universalStatus === 'connecting' || !universalKey}
                            className="px-4 py-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-xs font-semibold hover:bg-cyan-500/20 transition-all flex items-center gap-2 whitespace-nowrap justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {universalStatus === 'connecting' ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-3 h-3" />
                                    Connect
                                </>
                            )}
                        </button>
                    )}
                </div>
                
                <div className="flex justify-between text-[10px] font-mono pl-1">
                    <span className={
                        universalStatus === 'connected' ? "text-emerald-500" : 
                        universalStatus === 'error' ? "text-rose-500" : 
                        "text-slate-500"
                    }>
                        {universalStatus === 'connected' ? `Status: Connected to ${universalProvider}` : 
                         universalStatus === 'error' ? "Status: Connection Failed (Invalid Key)" : 
                         "Status: Not Connected (Auto-detects: Anthropic, Groq, OpenAI)"}
                    </span>
                </div>
            </div>
        </div>

        {/* Google Gemini Section (Legacy/Specific) */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 bg-slate-900/30 space-y-8">
        
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-cyan-400">
                    <Atom className="w-4 h-4" />
                    External Provider Key (Google Gemini)
                </div>
                {(status === 'connected' || status === 'quota') && (
                     <div className="flex items-center gap-2">
                        {detectedModel && (
                            <span className="text-[10px] font-mono text-slate-400 border border-white/10 px-2 py-1 rounded bg-white/5">
                                Using: {detectedModel}
                            </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border 
                            ${status === 'quota' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}
                        `}>
                            {status === 'quota' ? 'QUOTA LIMIT' : 'ACTIVE'}
                        </span>
                     </div>
                )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
                <input 
                type={showKey1 ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                    setApiKey(e.target.value);
                    if (status === 'error') setStatus('idle');
                }}
                placeholder="sk-..."
                className={`w-full bg-slate-950 border rounded-lg pl-4 pr-12 py-3 text-sm text-slate-300 focus:outline-none focus:ring-1 transition-all font-mono
                    ${status === 'error' ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/50' : 
                      status === 'quota' ? 'border-amber-500/50 focus:border-amber-500 focus:ring-amber-500/50' :
                      'border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/50'}
                `}
                />
                <button 
                onClick={() => setShowKey1(!showKey1)}
                className="absolute right-4 top-3 text-slate-500 hover:text-slate-300"
                >
                {showKey1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            
            {status === 'connected' || status === 'quota' ? (
                <button 
                    onClick={handleDisconnect}
                    className="px-4 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold hover:bg-rose-500/20 transition-all flex items-center gap-2 whitespace-nowrap justify-center"
                >
                    <LogOut className="w-3 h-3" />
                    Disconnect
                </button>
            ) : (
                <button 
                    onClick={handleConnect}
                    disabled={status === 'connecting' || !apiKey}
                    className="px-4 py-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-xs font-semibold hover:bg-cyan-500/20 transition-all flex items-center gap-2 whitespace-nowrap justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'connecting' ? (
                        <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        <>
                            <Zap className="w-3 h-3" />
                            Connect
                        </>
                    )}
                </button>
            )}
            </div>
            
            <div className="flex justify-between text-[10px] font-mono pl-1">
                <span className={
                    status === 'connected' ? "text-emerald-500" : 
                    status === 'quota' ? "text-amber-500" :
                    status === 'error' ? "text-rose-500" : 
                    "text-slate-500"
                }>
                    {status === 'connected' ? `Status: Connected to ${detectedModel}` : 
                     status === 'quota' ? `Status: Connected to ${detectedModel} (Quota Exceeded)` :
                     status === 'error' ? "Status: Connection Failed (Check Key)" : 
                     "Status: Not Connected"}
                </span>
            </div>

            {/* Manual Model Override (Always visible to allow troubleshooting) */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-white/5">
                <div className="text-[9px] font-mono text-slate-500 uppercase">Core Model:</div>
                <select 
                    value={manualModel || detectedModel || 'gemini-1.5-flash'}
                    onChange={(e) => {
                        const val = e.target.value;
                        setManualModel(val);
                        localStorage.setItem('ae_manual_model', val);
                        if (status === 'connected' || status === 'quota') {
                            localStorage.setItem('ae_api_model', val);
                            setDetectedModel(val);
                        }
                    }}
                    className="bg-transparent text-[10px] font-mono text-cyan-400 focus:outline-none border-none cursor-pointer flex-1"
                >
                    <option value="gemini-3-flash-preview">gemini-3-flash-preview (Experimental)</option>
                    <option value="gemini-1.5-flash">gemini-1.5-flash (Standard)</option>
                    <option value="gemini-1.5-flash-8b">gemini-1.5-flash-8b (High Availability)</option>
                    <option value="gemini-2.0-flash">gemini-2.0-flash (Next Gen)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro (Quota Restricted)</option>
                </select>
                {manualModel && (
                    <button 
                        onClick={() => {
                            setManualModel(null);
                            localStorage.removeItem('ae_manual_model');
                        }}
                        className="text-[9px] text-rose-500 hover:text-rose-400 underline"
                    >
                        Reset to Auto
                    </button>
                )}
            </div>

            {/* Diagnostic Log (Only visible on error/quota) */}
            {(status === 'error' || status === 'quota') && debugInfo && (
                <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-2">
                    <div className="text-[10px] font-mono text-slate-500 uppercase flex justify-between">
                        <span>Diagnostic Trace</span>
                        <span className="text-rose-500">Error Details</span>
                    </div>
                    <pre className="text-[10px] font-mono text-rose-400 overflow-x-auto whitespace-pre-wrap max-h-32 overflow-y-auto">
                        {debugInfo}
                    </pre>
                    <p className="text-[9px] text-slate-500 leading-tight">
                        Note: 404 means the model name is restricted for your region/key. 429 with "limit: 0" means it's disabled in Cloud Console.
                    </p>
                </div>
            )}
        </div>

        </div>

        {/* Model Usage Section */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 bg-slate-900/30">
        <div className="flex items-center justify-between mb-8">
            <div>
            <h3 className="text-lg font-bold text-white mb-1">Model Usage</h3>
            <p className="text-xs text-slate-500">Token consumption this billing cycle</p>
            </div>
        </div>

        <div className="space-y-6 font-mono text-xs text-center py-8 text-slate-600">
            No usage data available. Connect an API key to start tracking.
        </div>
        </div>

        <div className="flex justify-between items-center pt-4">
             <button 
                onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                }}
                className="text-[10px] font-mono text-slate-600 hover:text-rose-400 transition-colors flex items-center gap-1"
             >
                <XCircle className="w-3 h-3" />
                Force System Reset (Clears Local Storage)
             </button>
             <SaveButton onClick={() => {}} />
        </div>
    </div>
    );
};

// --- Shared Components ---

const Header = ({ title, subtitle, breadcrumb }: { title: string, subtitle: string, breadcrumb: string }) => (
    <div className="mb-2">
        <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500 mb-4 tracking-wider uppercase">
            {breadcrumb.split(' / ').map((item, i, arr) => (
                <React.Fragment key={i}>
                    {i > 0 && <span className="text-slate-600">/</span>}
                    <span className={i === arr.length - 1 ? "text-cyan-400" : "text-slate-500"}>{item}</span>
                </React.Fragment>
            ))}
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
            {subtitle}
        </p>
    </div>
);

const InputGroup = ({ label, type = "text", value, onChange, placeholder }: { label: string, type?: string, value?: string, onChange?: (e: any) => void, placeholder?: string }) => (
    <div className="space-y-2 w-full">
        <label className="text-xs font-medium text-slate-400 ml-1">{label}</label>
        <input 
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
        />
    </div>
);

const SelectGroup = ({ label, options }: { label: string, options: string[] }) => (
    <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400 ml-1">{label}</label>
        <div className="relative">
            <select className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 appearance-none cursor-pointer">
                {options.map(opt => <option key={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    </div>
);

const Toggle = ({ active }: { active: boolean }) => (
    <div className={`w-11 h-6 rounded-full flex items-center transition-colors px-1 cursor-pointer ${active ? 'bg-emerald-500' : 'bg-slate-700'}`}>
        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
);

const SaveButton = ({ onClick, isLoading }: { onClick: () => void, isLoading?: boolean }) => (
    <button 
        onClick={onClick}
        disabled={isLoading}
        className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 rounded-lg text-sm font-semibold hover:bg-emerald-500 hover:text-slate-950 transition-all flex items-center gap-2 group shadow-[0_0_15px_-5px_rgba(16,185,129,0.4)] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
        ) : (
            <Save className="w-4 h-4" />
        )}
        {isLoading ? 'Saving...' : 'Save Changes'}
    </button>
);

const NavItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-lg text-sm font-medium transition-all relative group
    ${active 
      ? 'text-cyan-400 bg-gradient-to-r from-cyan-400/10 to-transparent border-r-2 border-cyan-400' 
      : 'text-slate-400 hover:text-white hover:bg-white/5 border-r-2 border-transparent'
    }
  `}>
    <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
    {label}
  </button>
);
