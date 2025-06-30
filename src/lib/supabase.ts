import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Registration {
  id: string
  customer_id: string
  category: string
  name: string
  address: string
  mobile_number: string
  panchayath: string
  ward: string
  agent_pro: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Panchayath {
  id: string
  name: string
  district: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  actual_fee: number
  offer_fee: number
  image_url: string
  popup_image_url: string
  is_active: boolean
  created_at: string
}

export interface Admin {
  id: string
  username: string
  password: string
  role: 'super_admin' | 'local_admin' | 'user_admin'
  created_at: string
}