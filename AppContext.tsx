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
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name || '',
          email: profile.email,
          avatar: profile.avatar_url || undefined,
          title: profile.title || undefined,
          institution: profile.institution || undefined
        });
        
        // Load user's projects
        await loadProjects(userId);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // --- Helper: Load Projects ---
  const loadProjects = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
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
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  // --- Auth State Listener ---
  useEffect(() => {
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
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
          data: {
            full_name: fullName,
            research_field: field
          }
        }
      });
      
      if (error) throw error;
      
      // Profile is auto-created by trigger, fetch it
      if (data.user) {
        await fetchUserProfile(data.user.id);
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