import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Save, ArrowLeft, LogOut } from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";
import ProfileAvatarUpload from "@/components/ProfileAvatarUpload";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { API_URL } from "@/lib/config";
import { getAuthToken, supabase } from "@/lib/supabase";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const profileData = result.data;
        
        // Get OAuth avatar from Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        const oauthAvatar = 
          session?.user?.user_metadata?.picture || 
          session?.user?.user_metadata?.avatar_url || 
          session?.user?.user_metadata?.avatar;
        
        // Priority: Custom uploaded > OAuth > null
        const finalAvatar = profileData.avatar_url || oauthAvatar;
        
        console.log('📸 Profile avatar:', {
          custom: profileData.avatar_url,
          oauth: oauthAvatar,
          final: finalAvatar
        });
        
        setProfile({
          ...profileData,
          avatar_url: finalAvatar
        });
        setDisplayName(profileData.display_name || profileData.email?.split('@')[0] || "");
      }
    } catch (error) {
      console.error("Profile load error:", error);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          display_name: displayName,
        }),
      });

      if (response.ok) {
        toast.success("✅ প্রোফাইল আপডেট হয়েছে!");
        
        // Refresh user data in AuthContext
        await refreshUserData();
        
        // Reload page after 1 second to update everywhere
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const error = await response.json();
        toast.error(error.error || "আপডেট ব্যর্থ");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("আপডেট ব্যর্থ");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdated = async (newAvatarUrl: string) => {
    setProfile({ ...profile, avatar_url: newAvatarUrl });
    
    // Refresh user data in AuthContext
    await refreshUserData();
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logout();
      toast.success('লগআউট সফল হয়েছে');
      navigate('/login');
    } catch (error) {
      toast.error('লগআউট করতে সমস্যা হয়েছে');
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-bold"
          >
            <ArrowLeft size={20} />
            ড্যাশবোর্ডে ফিরে যান
          </button>
          <h1 className="text-3xl font-black text-gray-900">আমার প্রোফাইল</h1>
          <p className="text-gray-600 mt-2">আপনার প্রোফাইল তথ্য আপডেট করুন</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
          {/* Avatar Section */}
          <div className="flex justify-center mb-8">
            <ProfileAvatarUpload
              currentAvatar={profile.avatar_url}
              onAvatarUpdated={handleAvatarUpdated}
            />
          </div>

          {/* Profile Info */}
          <div className="space-y-6">
            {/* Display Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <User size={16} />
                প্রদর্শন নাম
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all font-medium"
                placeholder="আপনার নাম লিখুন"
              />
              <p className="text-xs text-gray-500 mt-1">
                এই নামটি রিভিউ এবং অর্ডারে দেখানো হবে
              </p>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Mail size={16} />
                ইমেইল
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600 font-medium cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                ইমেইল পরিবর্তন করা যাবে না
              </p>
            </div>

            {/* Created At */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Calendar size={16} />
                যোগদানের তারিখ
              </label>
              <input
                type="text"
                value={new Date(profile.created_at).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                disabled
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600 font-medium cursor-not-allowed"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-black text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  সেভ হচ্ছে...
                </>
              ) : (
                <>
                  <Save size={20} />
                  প্রোফাইল সেভ করুন
                </>
              )}
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-500 rounded-xl font-black text-lg border-2 border-red-200 hover:bg-red-100 hover:shadow-lg transition-all"
          >
            <LogOut size={20} />
            লগআউট
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-medium">
            💡 <strong>টিপস:</strong> আপনার প্রোফাইল ছবি এবং নাম সব জায়গায় দেখানো হবে - রিভিউ, অর্ডার, এবং সাপোর্ট মেসেজে।
          </p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      <Footer />
    </div>
  );
}
