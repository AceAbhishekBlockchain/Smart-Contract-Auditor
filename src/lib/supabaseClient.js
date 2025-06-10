
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bmvpthlonkpdhvfkgeaa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdnB0aGxvbmtwZGh2ZmtnZWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NDkzNzYsImV4cCI6MjA2NTEyNTM3Nn0.G9rSNMOSI7uiYXo8DuxPQQ0vcP9Q-Z6Ngxz5gssH6g4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
