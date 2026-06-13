import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://davvpymbybvniexmkgcu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdnZweW1ieWJ2bmlleG1rZ2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDkyNzYsImV4cCI6MjA5NjkyNTI3Nn0.am0GEETtim_xQiwoGiHmBduCzzITnS8mpAruCrDUPdU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
