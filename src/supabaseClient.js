import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = 'https://npgtexflicwrzzoshjnf.supabase.co';
   const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wZ3RleGZsaWN3cnp6b3Noam5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTk3OTUsImV4cCI6MjA2MTc5NTc5NX0.Cxa8TXNKLMH2043sATiAd17zjfaurSl7QZIZzl7Enjk';

   export const supabase = createClient(supabaseUrl, supabaseKey);