import { createClient } from '@supabase/supabase-js'

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// Fallback to placeholder if URL is invalid (e.g. from dummy .env text)
if (!supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://placeholder.supabase.co';
}

if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'taruh_url_anda_disini') {
  console.warn('VITE_SUPABASE_URL is missing or invalid. Mode Dummy is active.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
