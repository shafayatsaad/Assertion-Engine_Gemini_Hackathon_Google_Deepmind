
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wknyxakwrrwlzbvwtrir.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrbnl4YWt3cnJ3bHpidnd0cmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTgwNzksImV4cCI6MjA4NTk3NDA3OX0.4z8wgyTw6pamtstMJzALtrPcU2IvCQVCxq4KUQuDgbU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  try {
    const userId = '32fce146-c5b9-4116-8ced-3709dc3fdf51'; // User from screenshot
    console.log(`Attempting to fetch profile for ${userId}...`);
    
    // exact query from AppContext
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    console.log('Query finished.');
    
    if (error) {
       console.log('Error:', error);
    } else {
       console.log('Profile found:', profile);
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
