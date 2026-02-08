/// <reference types="vite/client" />
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// --- Types Definitions ---

export interface User {
  id: string; // Supabase UUID
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  institution?: string;
  bio?: string;
}

export interface Paper {
  id: string;
  title: string;
  similarity: number;
  image: string;
  status: 'critical' | 'warning' | 'safe';
  abstract: string;
  architecture?: string;
  dataset?: string;
  results?: string;
}

export interface Pivot {
  type: string;
  desc: string;
  impact: 'high' | 'medium' | 'low';
}

export interface Vulnerability {
  type: 'CRITICAL' | 'MODERATE' | 'SUGGESTION';
  title: string;
  desc: string;
  riskScore: string;
  action: string;
}

export interface Specimen {
  id: string;
  name: string;
  type: 'vision' | 'tabular' | 'audio';
  status: 'active' | 'pending';
  riskLevel: 'info' | 'warning' | 'critical';
  riskText: string;
  suitability: number;
  predictionData?: number[];
  featureWeights?: FeatureWeight[];
  samplePurityGrid?: SamplePurity[];
  surgeonInsight?: string;
}

export interface FeatureWeight {
    name: string;
    weight: number;
    type: 'signal' | 'noise' | 'toxic';
    enabled: boolean;
}

export interface SamplePurity {
    id: string;
    quality: 'elite' | 'radioactive' | 'bias';
}

export interface ProjectMetrics {
  confidence: number;
  samples: number;
  computeTime: string;
  logicConsistency: number;
  dataLineage: number;
  noveltyIndex: number;
}

export interface Project {
  id: string;
  title: string;
  hypothesis: string;
  assumptions: string[];
  status: 'ANALYZING' | 'COMPLETE' | 'FLAGGED' | 'ARCHIVED';
  progress: number;
  updated: string; // ISO string
  logs: Log[];
  analysisChat?: { role: 'ai' | 'user', text: string, timestamp: string }[];
  
  metrics: ProjectMetrics;
  specimens: Specimen[];
  noveltyPapers: Paper[];
  pivots?: Pivot[];
  vulnerabilities?: Vulnerability[];
  fullContent?: string;
  scopeFocus?: string[];
  scopeAbort?: string[];
  roadmap?: { phase: number, title: string, desc: string }[];
}

export interface Log {
  id: string;
  time: string;
  module: string;
  event: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

// Context Interface
interface AppContextType {
  user: User | null;
  projects: Project[];
  activeProjectId: string | null;
  logs: Log[];
  isLoading: boolean;
  // Auth Functions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, field?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  // Project Functions
  createProject: (data: Partial<Project>) => Promise<string>;
  setActiveProject: (id: string) => void;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getActiveProject: () => Project | undefined;
  // System Functions
  addLog: (log: Omit<Log, 'id' | 'time'>) => void;
  clearLogs: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider Component
 * 
 * Acts as the central state store for the application.
 * Now uses Supabase for authentication and data persistence.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Helper: Fetch User Profile ---
  const fetchUserProfile = async (userId: string, fallbackUser?: any) => {
    console.log('👤 Fetching profile for user:', userId);
    
    try {
      console.log('📡 Attempting to fetch profile from Supabase...');
      
      let profile = null;
      let error = null;
      let retries = 3;

      while (retries > 0) {
          try {
              console.log(`📡 Fetching profile (Attempt ${4 - retries}/3)...`);
              
              const timeoutPromise = new Promise((_, reject) => {
                  setTimeout(() => reject(new Error('Request timed out')), 15000);
              });

              const profilePromise = supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', userId)
                  .single();

              const result: any = await Promise.race([profilePromise, timeoutPromise]);
              profile = result.data;
              error = result.error;

              if (error) {
                  console.warn(`⚠️ Error fetching profile (Attempt ${4 - retries}):`, error);
                  if (retries > 1) {
                      retries--;
                      await new Promise(res => setTimeout(res, 1000));
                      continue;
                  }
              }
              
              // If we got here with no error, or if we ignored the error but have no data (unlikely with single()), break.
              // Actually single() returns error if no row.
              break; 

          } catch (err) {
              console.error(`❌ Fetch attempt ${4 - retries} failed:`, err);
              error = err;
              if (retries > 1) {
                  retries--;
                  await new Promise(res => setTimeout(res, 1000));
              } else {
                  break;
              }
          }
      }
      
      console.log('📊 Profile query result:', { 
        hasProfile: !!profile, 
        hasError: !!error, 
        errorCode: error?.code,
        errorMessage: error?.message,
        errorDetails: error?.details,
        errorHint: error?.hint
      });
      
      if (error) {
        console.error('❌ Supabase error details:', error);
        
        // If error is PGRST116 (not found), that's expected for new users
        if (error.code === 'PGRST116') {
          console.log('⚠️ Profile not found (expected for new user), creating new profile...');
        } else {
          console.error('❌ Unexpected database error:', error);
          throw new Error(`Database error: ${error.message}`);
        }
      }
      
      if (!profile) {
        console.log('⚠️ No profile found, creating new profile...');
        
        // Use fallback user if provided, otherwise try to get from session (local)
        let currentUser = fallbackUser;
        if (!currentUser) {
            const { data: { session } } = await supabase.auth.getSession();
            currentUser = session?.user;
        }
        
        if (currentUser) {
          console.log('📝 Creating profile for:', currentUser.email);
          
          // Try to create profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: currentUser.email,
              full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
              updated_at: new Date().toISOString()
            });
          
          if (insertError && insertError.code !== '23505') { // Ignore duplicate key error
            console.warn('⚠️ Profile creation failed:', insertError);
          } else {
            console.log('✅ Profile created successfully');
          }
          
          // Set user state regardless of insert success
          setUser({
            id: userId,
            name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email || '',
          });
          
          console.log('✅ User state set');
          await loadProjects(userId);
          return;
        }
      }
      
      if (profile) {
        console.log('✅ Profile found, setting user state');
        setUser({
          id: profile.id,
          name: profile.full_name || '',
          email: profile.email || '',
          avatar: profile.avatar_url,
          title: profile.title,
          institution: profile.institution,
          bio: profile.bio
        });
        await loadProjects(userId);
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      
      // Fallback: Always try to set user state from auth data if profile fetch fails
      try {
        let authUser = fallbackUser;
        if (!authUser) {
           // use getSession instead of getUser to avoid network call
           const { data: { session } } = await supabase.auth.getSession();
           authUser = session?.user;
        }

        if (authUser) {
          setUser({
            id: userId,
            name: authUser.email?.split('@')[0] || 'User',
            email: authUser.email || '',
          });
          console.log('✅ Using fallback user data after error');
          
          // We also try to load projects, but expect it might fail too if network is down
          loadProjects(userId).catch(e => console.warn('Projects load skipped due to error'));
        } else {
            console.warn('⚠️ Could not find auth user for fallback');
        }
      } catch (innerError) {
         console.error('❌ Fallback auth check failed:', innerError);
      }
    }
  };

  // --- Helper: Load Projects ---
  const loadProjects = async (userId: string) => {
    console.log('📁 Loading projects for user:', userId);
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Projects load timed out')), 5000);
      });

      const projectsPromise = supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const result: any = await Promise.race([projectsPromise, timeoutPromise]);
      const { data, error } = result;

      
      if (error) {
        console.error('❌ Error loading projects:', error);
        throw error;
      }
      
      console.log('📊 Projects data:', { count: data?.length || 0 });
      
      // Transform Supabase data to app format
      const transformedProjects: Project[] = (data || []).map((p: any) => {
        // Hydrate from localStorage for fields potentially missing in Supabase schema
        const localDataRaw = localStorage.getItem(`ae_project_ext_${p.id}`);
        const localData = localDataRaw ? JSON.parse(localDataRaw) : {};

        return {
          id: p.id,
          title: p.title,
          hypothesis: p.hypothesis,
          assumptions: p.assumptions || [],
          status: p.status as 'ANALYZING' | 'COMPLETE' | 'FLAGGED' | 'ARCHIVED',
          progress: p.progress || 0,
          updated: p.updated_at,
          logs: [],
          analysisChat: localData.analysisChat || [],
          metrics: {
            confidence: p.confidence || 0,
            samples: localData.metrics?.samples || 0,
            computeTime: localData.metrics?.computeTime || "0h 0m",
            logicConsistency: p.logic_consistency || 0,
            dataLineage: p.data_lineage || 0,
            noveltyIndex: p.novelty_index || 0,
            radar: p.radar || localData.metrics?.radar || "50,50,50,50,50"
          },
          vulnerabilities: p.vulnerabilities || localData.vulnerabilities || [],
          scopeFocus: p.scope_focus || localData.scopeFocus || [],
          scopeAbort: p.scope_abort || localData.scopeAbort || [],
          fullContent: p.full_content || localData.fullContent || "",
          specimens: localData.specimens || [],
          noveltyPapers: localData.noveltyPapers || []
        };
      });
      
      setProjects(transformedProjects);
      console.log('✅ Projects loaded & hydrated from LocalStorage mirror where applicable');
    } catch (error) {
      console.error('❌ Error loading projects:', error);
      // Don't throw - allow login to succeed even if projects fail to load
      setProjects([]);
    }
  };

  // --- Helper: Check Environment ---
  const checkEnv = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    console.log('🌍 Environment Check:', { 
      hasUrl: !!url, 
      urlPrefix: url ? url.substring(0, 8) + '...' : 'MISSING',
      hasKey: !!key,
      keyPrefix: key ? key.substring(0, 5) + '...' : 'MISSING',
      isConfigured: isSupabaseConfigured
    });
  };

  useEffect(() => {
    checkEnv();
  }, []);

  // --- Auth State Listener ---
  useEffect(() => {
    // If Supabase not configured, load from localStorage
    if (!isSupabaseConfigured) {
      const mockUser = localStorage.getItem('ae_mock_user');
      const storedProjects = localStorage.getItem('ae_projects');
      
      if (mockUser) {
        setUser(JSON.parse(mockUser));
      }
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
      setIsLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Error getting session:', error);
      } else if (session?.user) {
        console.log('✅ Found existing session for:', session.user.email);
        
        // OPTIMISTIC UPDATE: Set basic user state immediately so UI doesn't look broken
        setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            avatar: session.user.user_metadata?.avatar_url
        });
        
        await fetchUserProfile(session.user.id, session.user);
      } else {
        console.log('ℹ️ No active session found');
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth State Change:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Optimistic update
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            avatar: session.user.user_metadata?.avatar_url
          });
          await fetchUserProfile(session.user.id, session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProjects([]);
          setActiveProjectId(null);
        } else if (event === 'USER_UPDATED' && session?.user) {
           await fetchUserProfile(session.user.id, session.user);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // --- Auth Handlers ---

  const login = async (email: string, password: string) => {
    console.log('🔐 Login started for:', email);
    setIsLoading(true);
    try {
      // Fallback to mock login if Supabase not configured
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, using mock authentication');
        const mockUser: User = {
          id: 'mock-' + Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email,
          title: 'Researcher',
          institution: 'Research Institute'
        };
        setUser(mockUser);
        localStorage.setItem('ae_mock_user', JSON.stringify(mockUser));
        setIsLoading(false);
        console.log('✅ Mock login successful');
        return;
      }

      console.log('📡 Attempting Supabase login with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('📡 Supabase login response:', { 
        hasUser: !!data.user, 
        hasSession: !!data.session, 
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null
      });
      
      if (error) {
        console.error('❌ Supabase login error:', error);
        // Provide more helpful error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          throw new Error('Please confirm your email address. Check your inbox (and spam folder) for a confirmation link from Supabase.');
        } else {
          throw new Error(error.message);
        }
      }
      
      if (data.user) {
        console.log('👤 User authenticated successfully, waiting for event listener to handle profile...');
        // We rely on onAuthStateChange to trigger fetchUserProfile and optimistic updates
        // This prevents race conditions and "u is not a function" errors if state updates conflict
        console.log('✅ Login complete!');
      }
    } catch (error: any) {
      console.error('❌ Login wrapper error:', error);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('🔐 Login flow finished');
    }
  };

  const signup = async (email: string, password: string, fullName: string, field?: string) => {
    setIsLoading(true);
    console.log('📝 Signup started for:', email);
    
    try {
      // Fallback to mock signup if Supabase not configured
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, using mock authentication');
        const mockUser: User = {
          id: 'mock-' + Math.random().toString(36).substr(2, 9),
          name: fullName,
          email,
          title: 'Researcher',
          institution: field || 'Research Institute'
        };
        setUser(mockUser);
        localStorage.setItem('ae_mock_user', JSON.stringify(mockUser));
        setIsLoading(false);
        return;
      }

      console.log('📡 Sending signup request to Supabase...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin, // Important for redirect back after confirmation
          data: {
            full_name: fullName,
            field: field || 'Research'
          }
        }
      });
      
       console.log('📡 Supabase signup response:', { 
        hasUser: !!data.user, 
        hasSession: !!data.session, 
        isConfirmed: !!data.user?.confirmed_at,
        identities: data.user?.identities,
        error: error ? {
          message: error.message,
          status: error.status
        } : null
      });

      if (error) throw error;
      
      console.log('✅ User created in auth');
      
      // Check if email confirmation is required
      if (data.user && !data.user.confirmed_at && !data.session) {
         console.log('⚠️ Email confirmation required');
         // Use a specific error to signal the UI to show a "Check Email" message
         // But since we want to create the profile anyway if possible (wait, we can't create profile if RLS blocks unconfirmed users)
         // Actually, RLS usually allows insert for authenticated users. 
         // If email not confirmed, user is NOT authenticated yet in some configs, or is authenticated but has no session.
         // If no session, we can't create profile if RLS requires auth.
         
         // Let's throwing a helpful message
         throw new Error('Account created! Please check your email to confirm your account before logging in.');
      }

      // If we have a session (email confirmation disabled or auto-confirmed)
      if (data.user && (data.session || data.user.confirmed_at)) {
        console.log('👤 Authenticated immediately, creating profile...');
        
          // Create profile immediately after signup
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              updated_at: new Date().toISOString()
            });
          
          if (profileError) {
            console.warn('⚠️ Profile creation failed (might already exist):', profileError);
          } else {
            console.log('✅ Profile created successfully');
          }
          
          // Now fetch the profile (will use the one we just created or existing one)
          await fetchUserProfile(data.user.id, data.user);
      }
    } catch (error: any) {
      console.error('❌ Signup wrapper error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('🚪 Logout started');
    try {
      if (isSupabaseConfigured) {
        console.log('📡 Signing out from Supabase...');
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Sign out error:', error);
      }
      setUser(null);
      setProjects([]);
      setActiveProjectId(null);
      localStorage.removeItem('ae_mock_user');
      localStorage.removeItem('ae_projects');
      console.log('✅ Logout complete');
    } catch (error) {
      console.error('❌ Logout wrapper error:', error);
      throw error;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    console.log('👤 Updating user profile:', data);
    if (!user) {
      console.warn('⚠️ No user to update');
      return;
    }
    
    try {
      // Fallback to localStorage if Supabase not configured
      if (!isSupabaseConfigured) {
        console.log('💾 Using localStorage fallback for profile update');
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('ae_mock_user', JSON.stringify(updatedUser));
        console.log('✅ Profile updated in localStorage');
        return;
      }

      console.log('📡 Updating profile in Supabase...');
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.name,
          avatar_url: data.avatar,
          title: data.title,
          institution: data.institution,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('❌ Supabase update error:', error);
        throw error;
      }
      
      setUser(prev => prev ? { ...prev, ...data } : null);
      console.log('✅ Profile updated in Supabase');
    } catch (error) {
      console.error('❌ Update user error:', error);
      throw error;
    }
  };

  // --- Project Handlers ---

  const createProject = async (data: Partial<Project>): Promise<string> => {
    // Just-in-time Auth Check: If local user state is missing, try to fetch from Supabase directly
    if (!user && isSupabaseConfigured) {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        if (error || !authUser) throw new Error('Not authenticated: Session expired or invalid.');
        // If we have a valid auth user, we can proceed. The RLS will handle permission checks.
        // We might want to trigger a profile fetch here to restore state, but for now let's just allow the creation.
    } else if (!user) {
         throw new Error('Not authenticated');
    }
    
    try {
      // Fallback to localStorage if Supabase not configured
      if (!isSupabaseConfigured) {
        const newProject: Project = {
          id: Math.random().toString(36).substr(2, 9),
          title: data.title || 'Untitled Research',
          hypothesis: data.hypothesis || '',
          assumptions: data.assumptions || [],
          status: 'ANALYZING',
          progress: 0,
          updated: new Date().toISOString(),
          logs: [],
          analysisChat: [],
          metrics: {
            confidence: 0,
            samples: 0,
            computeTime: "0h 0m",
            logicConsistency: 0,
            dataLineage: 0,
            noveltyIndex: 0
          },
          specimens: [],
          noveltyPapers: []
        };
        
        setProjects(prev => {
          const updated = [newProject, ...prev];
          localStorage.setItem('ae_projects', JSON.stringify(updated));
          return updated;
        });
        setActiveProjectId(newProject.id);
        addLog({ module: 'System', event: `New Project Created: ${newProject.title}`, status: 'info' });
        return newProject.id;
      }

      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: data.title || 'Untitled Research',
          hypothesis: data.hypothesis || '',
          assumptions: data.assumptions || [],
          status: 'ANALYZING',
          progress: 0
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform to app format
      const transformedProject: Project = {
        id: newProject.id,
        title: newProject.title,
        hypothesis: newProject.hypothesis,
        assumptions: newProject.assumptions || [],
        status: newProject.status,
        progress: newProject.progress || 0,
        updated: newProject.updated_at,
        logs: [],
        analysisChat: [],
        metrics: {
          confidence: 0,
          samples: 0,
          computeTime: "0h 0m",
          logicConsistency: 0,
          dataLineage: 0,
          noveltyIndex: 0
        },
        specimens: [],
        noveltyPapers: []
      };
      
      setProjects(prev => [transformedProject, ...prev]);
      setActiveProjectId(newProject.id);
      
      // Initialize localStorage mirror
      localStorage.setItem(`ae_project_ext_${newProject.id}`, JSON.stringify(transformedProject));
      
      addLog({ module: 'System', event: `New Project Created: ${newProject.title}`, status: 'info' });
      
      return newProject.id;
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    try {
      // 1. Try to update Supabase for supported fields
      const { error } = await supabase
        .from('projects')
        .update({
          title: data.title,
          hypothesis: data.hypothesis,
          assumptions: data.assumptions,
          status: data.status,
          progress: data.progress,
          confidence: data.metrics?.confidence,
          logic_consistency: data.metrics?.logicConsistency,
          data_lineage: data.metrics?.dataLineage,
          novelty_index: data.metrics?.noveltyIndex
        })
        .eq('id', id);
      
      // If error (e.g. schema mismatch), we log but continue with local mirror
      if (error) {
          console.warn('⚠️ Supabase update had issues (possibly schema restricted):', error);
      }
      
      // 2. Update local state
      let updatedProject: Project | undefined;
      setProjects(prev => {
        const next = prev.map(p => {
          if (p.id === id) {
              updatedProject = { ...p, ...data, updated: new Date().toISOString() };
              return updatedProject;
          }
          return p;
        });
        
        // 3. Mirror the FULL project data to localStorage as a safety net
        if (updatedProject) {
            localStorage.setItem(`ae_project_ext_${id}`, JSON.stringify(updatedProject));
        }
        
        return next;
      });
      
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== id));
      if (activeProjectId === id) setActiveProjectId(null);
      addLog({ module: 'System', event: `Project Deleted`, status: 'warning' });
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  };

  const setActiveProject = (id: string) => {
    setActiveProjectId(id);
  };

  const getActiveProject = () => projects.find(p => p.id === activeProjectId);

  // --- System Log Handlers ---

  const addLog = (logData: Omit<Log, 'id' | 'time'>) => {
    const newLog: Log = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      ...logData
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100)); 
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <AppContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      updateUser,
      projects,
      activeProjectId,
      getActiveProject,
      setActiveProject,
      createProject,
      updateProject,
      deleteProject,
      logs,
      addLog,
      clearLogs
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};