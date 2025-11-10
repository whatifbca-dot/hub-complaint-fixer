import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ComplaintCategory = 'Technical' | 'Cleanliness' | 'Power/Network' | 'Infrastructure' | 'Staff-related';
export type ComplaintPriority = 'Low' | 'Medium' | 'High';
export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';
export type UserRole = 'student' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  roll_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  complaint_id: string;
  user_id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  attachment_url: string | null;
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  profiles?: Profile;
}
