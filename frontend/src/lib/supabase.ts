import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Recording = {
  id: string;
  user_id: string;
  user_email: string;
  audio_url: string;
  caption?: string;
  mood: string;
  created_at: string;
  reactions?: Array<{
    user_id: string;
    emoji: string;
    created_at: string;
  }>;
};

export type UserStatus = {
  user_id: string;
  is_online: boolean;
  last_seen: string;
};