import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nankdjfsdaipjrtvtddu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface User {
  id: string
  email: string
  username?: string
  avatar_url?: string
  balance: number
  gems: number
  created_at: string
  updated_at: string
}

export interface Game {
  id: string
  user_id: string
  game_type: 'bingo' | 'tournament' | 'daily'
  status: 'active' | 'completed' | 'cancelled'
  score: number
  numbers_called: number[]
  bingo_lines: number
  created_at: string
  completed_at?: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdrawal' | 'win' | 'loss' | 'bonus'
  amount: number
  status: 'pending' | 'completed' | 'failed'
  payment_method?: string
  created_at: string
  updated_at: string
} 