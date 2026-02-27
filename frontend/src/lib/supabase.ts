import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xgucnyuhwghctwihrkkh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhndWNueXVod2doY3R3aWhya2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMzM0OTksImV4cCI6MjA4NjgwOTQ5OX0.y7zqyLW7HsLnYQkmszu5k08-21KAKMQX1x9e8ZCFw2c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper to check if user is admin
export const isAdmin = async () => {
  const user = await getCurrentUser();
  return user?.user_metadata?.role === 'admin';
};

// Helper to get auth token with automatic refresh
export const getAuthToken = async () => {
  try {
    // First try to get current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error getting session:', error);
      return null;
    }
    
    // If no session, return null
    if (!session) {
      console.warn('⚠️ No active session');
      return null;
    }
    
    // Check if token is expired or about to expire (within 60 seconds)
    const expiresAt = session.expires_at || 0;
    const now = Math.floor(Date.now() / 1000);
    const isExpiringSoon = expiresAt - now < 60;
    
    if (isExpiringSoon) {
      console.log('🔄 Token expiring soon, refreshing session...');
      
      // Refresh the session
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('❌ Error refreshing session:', refreshError);
        // If refresh fails, try to use the old token anyway
        return session.access_token;
      }
      
      if (refreshData.session) {
        console.log('✅ Session refreshed successfully');
        return refreshData.session.access_token;
      }
    }
    
    return session.access_token;
  } catch (error) {
    console.error('❌ Error in getAuthToken:', error);
    return null;
  }
};
