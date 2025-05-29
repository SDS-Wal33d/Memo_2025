import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema:
/*
Table: profiles
- id (uuid, primary key, references auth.users.id)
- email (text, not null)
- full_name (text, not null)
- role (text, not null, default: 'student')
- student_id (text, unique)
- graduation_status (text, default: 'pending')
- created_at (timestamp with time zone, default: now())
*/

// Helper functions
export const createUserProfile = async (userData: {
  id: string;
  email: string;
  full_name: string;
  role?: string;
  student_id?: string;
}) => {
  const { data, error } = await supabase.from('profiles').insert([
    {
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      role: userData.role || 'student',
      student_id: userData.student_id,
      graduation_status: 'pending'
    }
  ]);

  if (error) throw error;
  return data;
};

export const updateGraduationStatus = async (userId: string, status: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ graduation_status: status })
    .eq('id', userId);

  if (error) throw error;
  return data;
};