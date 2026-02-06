import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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
}

export interface Specimen {
  id: string;
  name: string;
  type: 'vision' | 'tabular' | 'audio';
  status: 'active' | 'pending';
  riskLevel: 'info' | 'warning' | 'critical';
  riskText: string;
  suitability: number;
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
  
  // Dynamic Data Fields
  metrics: ProjectMetrics;
  specimens: Specimen[];
  noveltyPapers: Paper[];
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
  getActiveProject: () => Project | undefined;
  // System Functions
  addLog: (log: Omit<Log, 'id' | 'time'>) => void;
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
  const fetchUserProfile = async (userId: string) => {
    console.log('👤 Fetching profile for user:', userId);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      console.log('📊 Profile query result:', { hasProfile: !!profile, hasError: !!error, errorCode: error?.code });
      
      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('⚠️ Profile not found, creating new profile...');
          
          // Get user email from auth
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            console.log('📝 Creating profile for:', user.email);
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                updated_at: new Date().toISOString()
              })
              .select()
              .single();
            
            if (insertError) {
              console.error('❌ Error creating profile:', insertError);
              // Continue anyway with basic user data
              setUser({
                id: userId,
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                email: user.email || '',
              });
              console.log('✅ Using fallback user data');
              return;
            }
            
            if (newProfile) {
              console.log('✅ Profile created successfully');
              setUser({
                id: newProfile.id,
                name: newProfile.full_name || '',
                email: newProfile.email,
                avatar: newProfile.avatar_url || undefined,
                title: newProfile.title || undefined,
                institution: newProfile.institution || undefined
              });
              await loadProjects(userId);
            }
          }
          return;
        }
        
        throw error;
      }
      
      if (profile) {
        console.log('✅ Profile found:', profile.email);
        setUser({
          id: profile.id,
          name: profile.full_name || '',
          email: profile.email,
          avatar: profile.avatar_url || undefined,
          title: profile.title || undefined,
          institution: profile.institution || undefined
        });
        
        // Load user's projects
        console.log('📁 Loading projects...');
        await loadProjects(userId);
        console.log('✅ Projects loaded');
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      // Don't throw - allow login to succeed even if profile fetch fails
    }
  };

  // --- Helper: Load Projects ---
  const loadProjects = async (userId: string) => {
    console.log('📁 Loading projects for user:', userId);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error loading projects:', error);
        throw error;
      }
      
      console.log('📊 Projects data:', { count: data?.length || 0 });
      
      // Transform Supabase data to app format
      const transformedProjects: Project[] = (data || []).map(p => ({
        id: p.id,
        title: p.title,
        hypothesis: p.hypothesis,
        assumptions: p.assumptions || [],
        status: p.status as 'ANALYZING' | 'COMPLETE' | 'FLAGGED' | 'ARCHIVED',
        progress: p.progress || 0,
        updated: p.updated_at,
        logs: [],
        analysisChat: [],
        metrics: {
          confidence: p.confidence || 0,
          samples: 0,
          computeTime: "0h 0m",
          logicConsistency: p.logic_consistency || 0,
          dataLineage: p.data_lineage || 0,
          noveltyIndex: p.novelty_index || 0
        },
        specimens: [],
        noveltyPapers: []
      }));
      
      setProjects(transformedProjects);
      console.log('✅ Projects loaded successfully');
    } catch (error) {
      console.error('❌ Error loading projects:', error);
      // Don't throw - allow login to succeed even if projects fail to load
      setProjects([]);
    }
  };

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setProjects([]);
          setActiveProjectId(null);
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

      console.log('📡 Attempting Supabase login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('📡 Supabase response:', { hasData: !!data, hasError: !!error, userId: data?.user?.id });
      
      if (error) {
        console.error('❌ Supabase login error:', error);
        // Provide more helpful error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email address. Check your inbox for a confirmation link.');
        } else {
          throw new Error(error.message);
        }
      }
      
      if (data.user) {
        console.log('👤 User authenticated, fetching profile...');
        await fetchUserProfile(data.user.id);
        console.log('✅ Login complete!');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('🔐 Login flow finished');
    }
  };

  const signup = async (email: string, password: string, fullName: string, field?: string) => {
    setIsLoading(true);
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

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: fullName,
            field: field || 'Research'
          }
        }
      });
      
      if (error) throw error;
      
      // For demo purposes: If email confirmation is required but not confirmed,
      // we'll auto-login anyway (this works when email confirmation is disabled in Supabase settings)
      if (data.user) {
        // Check if user is confirmed or if we can proceed anyway
        if (data.user.confirmed_at || data.session) {
          await fetchUserProfile(data.user.id);
        } else {
          // Email confirmation required - inform user
          throw new Error('Please check your email to confirm your account. For demo purposes, you can disable email confirmation in Supabase Settings → Authentication → Email Auth → Confirm email.');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setProjects([]);
      setActiveProjectId(null);
      localStorage.removeItem('ae_mock_user');
      localStorage.removeItem('ae_projects');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.name,
          avatar_url: data.avatar,
          title: data.title,
          institution: data.institution
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  // --- Project Handlers ---

  const createProject = async (data: Partial<Project>): Promise<string> => {
    if (!user) throw new Error('Not authenticated');
    
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
      addLog({ module: 'System', event: `New Project Created: ${newProject.title}`, status: 'info' });
      
      return newProject.id;
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    try {
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
      
      if (error) throw error;
      
      // Update local state
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, ...data, updated: new Date().toISOString() } : p
      ));
    } catch (error) {
      console.error('Update project error:', error);
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

  return (
    <AppContext.Provider value={{ 
      user, 
      projects, 
      activeProjectId, 
      logs,
      isLoading,
      login, 
      logout, 
      signup,
      updateUser,
      createProject, 
      setActiveProject, 
      updateProject,
      addLog,
      getActiveProject
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