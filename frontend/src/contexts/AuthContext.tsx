import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userData: { name: string; email: string; avatar?: string; createdAt?: string } | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<any>;
  loginWithDiscord: () => Promise<any>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userData: null,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  loginWithDiscord: async () => {},
  logout: async () => {},
  refreshUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin by calling backend API
  const checkAdminStatus = async (email: string): Promise<boolean> => {
    try {
      console.log(`🔍 Checking admin status for: ${email}`);
      
      const response = await fetch(`${API_BASE}/admin/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        console.error('❌ Admin check failed:', response.status);
        return false;
      }

      const result = await response.json();
      const isAdmin = result.data?.isAdmin || false;
      
      console.log(`${isAdmin ? '✅' : '❌'} Admin check result for ${email}: ${isAdmin}`);
      
      return isAdmin;
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch custom avatar from backend
          const token = session.access_token;
          let customAvatar = null;
          let displayName = null;

          try {
            const response = await fetch(`${API_BASE}/users/profile`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const result = await response.json();
              customAvatar = result.data?.avatar_url;
              displayName = result.data?.display_name;
              console.log('✅ Custom avatar from DB:', customAvatar);
            }
          } catch (error) {
            console.log('ℹ️ No custom avatar in database');
          }

          // Get OAuth avatar from user metadata
          const oauthAvatar = 
            session.user.user_metadata?.picture || // Google OAuth (primary field)
            session.user.user_metadata?.avatar_url || // Google alternative
            session.user.user_metadata?.avatar || // Discord avatar
            session.user.user_metadata?.photo_url || // Alternative field
            session.user.user_metadata?.image_url; // Alternative field

          console.log('📸 OAuth avatar:', oauthAvatar);
          console.log('👤 User metadata:', session.user.user_metadata);

          // Avatar priority: Custom uploaded > OAuth > Generated
          const avatar = 
            customAvatar || 
            oauthAvatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User")}&background=FF3B30&color=fff&bold=true`;
          
          console.log('🎨 Final avatar URL:', avatar);
          
          const userEmail = session.user.email || "";
          
          // Check admin status from backend
          const isUserAdmin = await checkAdminStatus(userEmail);
          
          const userData = {
            id: session.user.id,
            email: userEmail,
            name: displayName || session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            avatar: avatar,
            role: isUserAdmin ? "admin" : "user",
          };
          setUser(userData);
          setUserData({
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
            createdAt: session.user.created_at,
          });
          setIsAdmin(isUserAdmin);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("isAdmin", isUserAdmin ? "true" : "false");
          // Store the access token for API calls
          localStorage.setItem("token", session.access_token);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch custom avatar from backend
        const token = session.access_token;
        let customAvatar = null;
        let displayName = null;

        try {
          const response = await fetch(`${API_BASE}/users/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            customAvatar = result.data?.avatar_url;
            displayName = result.data?.display_name;
            console.log('✅ Custom avatar from DB:', customAvatar);
          }
        } catch (error) {
          console.log('ℹ️ No custom avatar in database');
        }

        // Get OAuth avatar from user metadata
        const oauthAvatar = 
          session.user.user_metadata?.picture || // Google OAuth (primary field)
          session.user.user_metadata?.avatar_url || // Google alternative
          session.user.user_metadata?.avatar || // Discord avatar
          session.user.user_metadata?.photo_url || // Alternative field
          session.user.user_metadata?.image_url; // Alternative field

        console.log('📸 OAuth avatar:', oauthAvatar);

        // Avatar priority: Custom uploaded > OAuth > Generated
        const avatar = 
          customAvatar || 
          oauthAvatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User")}&background=FF3B30&color=fff&bold=true`;
        
        console.log('🎨 Final avatar URL:', avatar);
        
        const userEmail = session.user.email || "";
        
        // Check admin status from backend
        const isUserAdmin = await checkAdminStatus(userEmail);
        
        const userData = {
          id: session.user.id,
          email: userEmail,
          name: displayName || session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
          avatar: avatar,
          role: isUserAdmin ? "admin" : "user",
        };
        setUser(userData);
        setUserData({
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          createdAt: session.user.created_at,
        });
        setIsAdmin(isUserAdmin);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isAdmin", isUserAdmin ? "true" : "false");
        // Store the access token for API calls
        localStorage.setItem("token", session.access_token);
      } else {
        setUser(null);
        setUserData(null);
        setIsAdmin(false);
        localStorage.removeItem("user");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Store the access token
    if (data.session?.access_token) {
      localStorage.setItem("token", data.session.access_token);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    if (error) throw error;
    
    // Store the access token
    if (data.session?.access_token) {
      localStorage.setItem("token", data.session.access_token);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const refreshUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch updated profile from backend
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        let customAvatar = null;
        let displayName = null;

        if (response.ok) {
          const result = await response.json();
          customAvatar = result.data?.avatar_url;
          displayName = result.data?.display_name;
        }

        // Priority: Custom uploaded > OAuth > Generated
        const avatar = 
          customAvatar ||
          session.user.user_metadata?.avatar_url ||
          session.user.user_metadata?.avatar ||
          session.user.user_metadata?.picture ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User")}&background=FF3B30&color=fff&bold=true`;
        
        const userEmail = session.user.email || "";
        const isUserAdmin = await checkAdminStatus(userEmail);
        
        const userData = {
          id: session.user.id,
          email: userEmail,
          name: displayName || session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
          avatar: avatar,
          role: isUserAdmin ? "admin" : "user",
        };
        
        setUser(userData);
        setUserData({
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          createdAt: session.user.created_at,
        });
        setIsAdmin(isUserAdmin);
        localStorage.setItem("user", JSON.stringify(userData));
        
        console.log("✅ User data refreshed:", userData);
      }
    } catch (error) {
      console.error("❌ Error refreshing user data:", error);
    }
  };

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
    return data;
  };

  const loginWithDiscord = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'identify email',
      },
    });
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, userData, isAdmin, login, register, loginWithGoogle, loginWithDiscord, logout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}
