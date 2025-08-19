import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  last_login: string;
  profile_picture: string | null;
  preferences: string[];
  interests: string[];
  wanted_items: string[];
  favorites: string[];
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
  tags: string[];
  location: string;
  lat: number | null;
  lng: number | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'sold' | 'inactive';
  quantity: number;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  message_type: 'text' | 'meetup_request' | 'meetup_response';
  meetup_data?: {
    date: string;
    time: string;
    location: string;
    status: 'pending' | 'accepted' | 'declined' | 'reschedule_requested';
  };
}

export interface Chat {
  id: string;
  users: string[];
  listing_id: string | null;
  created_at: string;
  updated_at: string;
}
