import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if credentials are missing (for development)
const createMockClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
    signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: new Error('Supabase not configured') }), order: async () => ({ data: [], error: null }) }) }),
    insert: () => ({ select: () => ({ single: async () => ({ data: null, error: new Error('Supabase not configured') }) }) }),
    update: () => ({ eq: async () => ({ error: new Error('Supabase not configured') }) })
  })
});

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          title: string | null;
          institution: string | null;
          research_field: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          title?: string | null;
          institution?: string | null;
          research_field?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          title?: string | null;
          institution?: string | null;
          research_field?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          hypothesis: string;
          assumptions: string[];
          status: 'ANALYZING' | 'COMPLETE' | 'FLAGGED' | 'ARCHIVED';
          progress: number;
          confidence: number;
          logic_consistency: number;
          data_lineage: number;
          novelty_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          hypothesis: string;
          assumptions?: string[];
          status?: 'ANALYZING' | 'COMPLETE' | 'FLAGGED' | 'ARCHIVED';
          progress?: number;
          confidence?: number;
          logic_consistency?: number;
          data_lineage?: number;
          novelty_index?: number;
        };
        Update: {
          title?: string;
          hypothesis?: string;
          assumptions?: string[];
          status?: 'ANALYZING' | 'COMPLETE' | 'FLAGGED' | 'ARCHIVED';
          progress?: number;
          confidence?: number;
          logic_consistency?: number;
          data_lineage?: number;
          novelty_index?: number;
        };
      };
      specimens: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          authors: string[];
          year: number | null;
          source: string | null;
          url: string | null;
          abstract: string | null;
          relevance_score: number;
          status: 'pending' | 'validated' | 'flagged' | 'rejected';
          created_at: string;
        };
        Insert: {
          project_id: string;
          title: string;
          authors?: string[];
          year?: number | null;
          source?: string | null;
          url?: string | null;
          abstract?: string | null;
          relevance_score?: number;
          status?: 'pending' | 'validated' | 'flagged' | 'rejected';
        };
        Update: {
          title?: string;
          authors?: string[];
          year?: number | null;
          source?: string | null;
          url?: string | null;
          abstract?: string | null;
          relevance_score?: number;
          status?: 'pending' | 'validated' | 'flagged' | 'rejected';
        };
      };
      analysis_messages: {
        Row: {
          id: string;
          project_id: string;
          role: 'user' | 'ai';
          content: string;
          timestamp: string;
        };
        Insert: {
          project_id: string;
          role: 'user' | 'ai';
          content: string;
        };
        Update: {
          content?: string;
        };
      };
      novelty_scans: {
        Row: {
          id: string;
          project_id: string;
          scan_type: 'full' | 'incremental' | 'targeted';
          total_papers_scanned: number;
          similar_papers_found: number;
          novelty_score: number;
          threats: any; // JSONB
          status: 'running' | 'complete' | 'failed';
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          project_id: string;
          scan_type?: 'full' | 'incremental' | 'targeted';
          total_papers_scanned?: number;
          similar_papers_found?: number;
          novelty_score?: number;
          threats?: any;
          status?: 'running' | 'complete' | 'failed';
        };
        Update: {
          total_papers_scanned?: number;
          similar_papers_found?: number;
          novelty_score?: number;
          threats?: any;
          status?: 'running' | 'complete' | 'failed';
          completed_at?: string | null;
        };
      };
    };
  };
}
