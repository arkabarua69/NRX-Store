import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Edit, LogOut, 
  ShoppingBag, Heart, Bell, Settings, HelpCircle,
  ChevronRight, Shield, Crown, Camera, DollarSign, Gem
} from 'lucide-react';
import MobileLayout from '@/components/mobile-v2/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNotificationCount } from '@/hooks/useNotificationCount';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/uploadService';
import { userStatsService, UserStats } from '@/lib/userStatsService';
import LogoutConfirmModal from '@/components/LogoutConfirmModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProfileMobile() {
  const navigate = useNavigate();
  const { user, logout, refreshUserData } = useAuth();
  const { notifications } = useNotifications();
  const { unreadCount: notificationCount } = useNotificationCount();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    wishlistCount: 0,
    reviewCount: 0,
    totalSpent: 0,
    totalDiamonds: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch user stats on mount and refresh every 30 seconds
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoadingStats(true);
        const userStats = await userStatsService.getUserStats();
        setStats(userStats);
        console.log('📊 Stats updated:', userStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();

    // Refresh stats every 10 seconds for real-time updates
    const interval = setInterval(fetchStats, 10000);

    return () => clearInterval(interval);
  }, [user]);

  // Refresh stats when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        userStatsService.getUserStats().then(setStats).catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('শুধুমাত্র ছবি আপলোড করুন');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ছবির সাইজ ৫MB এর কম হতে হবে');
      return;
    }

    setUploadingAvatar(true);
    toast.info('আপলোড হচ্ছে...');

    try {
      const data = await uploadImage(file, 'avatars');
      
      if (!data?.url) {
        throw new Error('আপলোড ব্যর্থ হয়েছে');
      }

      const avatarUrl = data.url;

      // Update user profile with new avatar
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar_url: avatarUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('প্রোফাইল আপডেট ব্যর্থ হয়েছে');
      }

      // Refresh user data to get updated avatar
      await refreshUserData();
      
      toast.success('অ্যাভাটার আপডেট সফল হয়েছে!');
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error(error.message || 'আপলোড ব্যর্থ হয়েছে');
    } finally {
      setUploadingAvatar(false);
    }
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

  const menuItems = [
    {
      icon: ShoppingBag,
      label: 'আমার অর্ডার',
      path: '/dashboard',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Heart,
      label: 'উইশলিস্ট',
      path: '/wishlist',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: Bell,
      label: 'নোটিফিকেশন',
      path: '/notifications',
      gradient: 'from-yellow-500 to-orange-500',
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      icon: Settings,
      label: 'সেটিংস',
      path: '/settings',
      gradient: 'from-gray-500 to-gray-600',
    },
    {
      icon: HelpCircle,
      label: 'সাপোর্ট',
      path: '/support',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <MobileLayout
      showAppBar={true}
      showNavBar={true}
      appBarProps={{
        showLogo: true,
        showNotification: true,
        notificationCount: notificationCount,
      }}
    >
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 px-4 pt-6 pb-8">
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/50 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-white" />
              )}
            </div>
            {user?.role === 'admin' && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Crown size={14} className="text-white" />
              </div>
            )}
            {/* Avatar Upload Button */}
            <label 
              htmlFor="avatar-upload-profile"
              className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity cursor-pointer ${uploadingAvatar ? 'opacity-100' : ''}`}
            >
              {uploadingAvatar ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={24} className="text-white" />
              )}
            </label>
            <input
              id="avatar-upload-profile"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploadingAvatar}
            />
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-white mb-1 truncate">
              {user?.name || 'Guest User'}
            </h2>
            <p className="text-white/80 text-sm truncate">{user?.email}</p>
            {user?.role === 'admin' && (
              <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full mt-2">
                <Shield size={12} className="text-yellow-300" />
                <span className="text-xs font-bold text-white">Admin</span>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <button
            onClick={() => navigate('/settings')}
            className="p-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 active:scale-95 transition-transform"
          >
            <Edit size={20} className="text-white" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { 
              label: 'অর্ডার', 
              value: stats.totalOrders, 
              icon: ShoppingBag,
              gradient: 'from-blue-500 to-cyan-500',
              loading: loadingStats
            },
            { 
              label: 'খরচ', 
              value: stats.totalSpent, 
              icon: DollarSign,
              gradient: 'from-green-500 to-emerald-500',
              prefix: '৳',
              loading: loadingStats
            },
            { 
              label: 'ডায়মন্ড', 
              value: stats.totalDiamonds, 
              icon: Gem,
              gradient: 'from-purple-500 to-pink-500',
              loading: loadingStats
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30"
            >
              <div className={`flex items-center justify-center mb-1 w-8 h-8 mx-auto bg-gradient-to-br ${stat.gradient} rounded-lg`}>
                <stat.icon size={16} className="text-white" />
              </div>
              {stat.loading ? (
                <div className="h-7 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <motion.p 
                  key={stat.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-xl font-black text-white text-center truncate"
                >
                  {stat.prefix || ''}{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </motion.p>
              )}
              <p className="text-xs text-white/80 text-center font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className={`p-3 bg-gradient-to-br ${item.gradient} rounded-xl shadow-lg`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-black text-gray-900">{item.label}</h3>
              </div>
              {item.badge && (
                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black">
                  {item.badge}
                </div>
              )}
              <ChevronRight size={20} className="text-gray-400" />
            </motion.button>
          );
        })}
      </div>

      {/* Admin Panel Button */}
      {user?.role === 'admin' && (
        <div className="px-4 pb-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => navigate('/admin-dashboard')}
            className="w-full flex items-center gap-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-xl active:scale-[0.98] transition-transform"
          >
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <Shield size={22} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-black text-white">Admin Panel</h3>
              <p className="text-xs text-white/80">ড্যাশবোর্ড ম্যানেজ করুন</p>
            </div>
            <ChevronRight size={20} className="text-white" />
          </motion.button>
        </div>
      )}

      {/* Logout Button */}
      <div className="px-4 pb-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-500 px-6 py-4 rounded-2xl font-black border-2 border-red-200 active:bg-red-100 transition-colors"
        >
          <LogOut size={22} />
          <span>লগআউট</span>
        </motion.button>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </MobileLayout>
  );
}
