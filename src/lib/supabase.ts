import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdGt4cHFrdnpmeWJhcWRyYWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4OTU3NzgsImV4cCI6MjAyMjQ3MTc3OH0.7_XkOkOHhDcS9yQX5IHf3lDCxVaHeYCcestUF5MlxFs';

export const supabase = createClient(supabaseUrl, supabaseKey);