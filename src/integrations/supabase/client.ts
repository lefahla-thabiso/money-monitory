
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zpeiwnmhcvnheapptkej.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwZWl3bm1oY3ZuaGVhcHB0a2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTk5OTYsImV4cCI6MjA1NzE5NTk5Nn0.npVmrNP3QwGIIv1MhYcdxSy5DZUmj12qn3sKXXRpP1Q";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
