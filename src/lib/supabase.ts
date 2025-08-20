import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching our schema
export interface Profile {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  profile_picture: string;
  created_at: string;
  updated_at: string;
  last_login: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  tags: string[];
  location: string;
  lat?: number;
  lng?: number;
  user_id: string;
  status: 'active' | 'sold' | 'inactive';
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  listing_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationParticipant {
  conversation_id: string;
  user_id: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

// Database table names
export const TABLES = {
  PROFILES: 'profiles',
  LISTINGS: 'listings',
  CONVERSATIONS: 'conversations',
  CONVERSATION_PARTICIPANTS: 'conversation_participants',
  MESSAGES: 'messages',
} as const;

// Allowed tags for listings (as per requirements)
export const ALLOWED_TAGS = [
  'Textbooks',
  'Electronics', 
  'Clothing',
  'Furniture',
  'Tickets',
  'Appliances',
  'Other'
] as const;

export type AllowedTag = typeof ALLOWED_TAGS[number];
