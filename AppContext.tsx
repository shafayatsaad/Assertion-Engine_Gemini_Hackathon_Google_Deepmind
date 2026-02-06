import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Types Definitions ---

export interface User {
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
  status: 'ANALYZING' | 'COMPLETED' | 'FAILED' | 'REVIEW';
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
  // Auth Functions
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  // Project Functions
  createProject: (data: Partial<Project>) => string;
  setActiveProject: (id: string) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  getActiveProject: () => Project | undefined;
  // System Functions
  addLog: (log: Omit<Log, 'id' | 'time'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider Component
 * 
 * Acts as the central state store for the application.
 * Handles persistence to localStorage to maintain state across reloads.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  // --- Persistence Logic ---
  useEffect(() => {
    const storedUser = localStorage.getItem('ae_user');
    const storedProjects = localStorage.getItem('ae_projects');
    const storedLogs = localStorage.getItem('ae_logs');
    const storedActiveId = localStorage.getItem('ae_active_project_id');
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedProjects) setProjects(JSON.parse(storedProjects));
    if (storedLogs) setLogs(JSON.parse(storedLogs));
    if (storedActiveId) setActiveProjectId(storedActiveId);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('ae_user', JSON.stringify(user));
    else localStorage.removeItem('ae_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ae_projects', JSON.stringify(projects));
  }, [projects]);
  
  useEffect(() => {
    localStorage.setItem('ae_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (activeProjectId) localStorage.setItem('ae_active_project_id', activeProjectId);
    else localStorage.removeItem('ae_active_project_id');
  }, [activeProjectId]);

  // --- Auth Handlers ---

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setActiveProjectId(null);
    localStorage.removeItem('ae_user');
    localStorage.removeItem('ae_active_project_id');
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  // --- Project Handlers ---

  /**
   * Creates a new project with default initialization values.
   */
  const createProject = (data: Partial<Project>) => {
    const newProject: Project = {
      id: Math.floor(Math.random() * 10000).toString(),
      title: data.title || 'Untitled Research',
      hypothesis: data.hypothesis || '',
      assumptions: data.assumptions || [],
      status: 'ANALYZING',
      progress: 0,
      updated: new Date().toISOString(),
      logs: [],
      analysisChat: [],
      // Initialize with empty/zero values so UI shows "waiting" state
      metrics: {
        confidence: 0,
        samples: 0,
        computeTime: "0h 0m",
        logicConsistency: 0,
        dataLineage: 0,
        noveltyIndex: 0
      },
      specimens: [],
      noveltyPapers: [],
      ...data
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    addLog({ module: 'System', event: `New Project Created: ${newProject.title}`, status: 'info' });
    return newProject.id;
  };

  /**
   * Updates a specific project by ID.
   */
  const updateProject = (id: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data, updated: new Date().toISOString() } : p));
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
      login, 
      logout, 
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