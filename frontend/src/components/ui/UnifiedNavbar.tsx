import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Menu, X, LogOut, LayoutDashboard, Package, Gift, Star,
  ChevronDown, Crown, Zap, Shield, HeadphonesIcon, Sparkles, Settings,
  Bell, LogIn, UserPlus, Info, HelpCircle, Upload, CheckCircle, Clock,
  ArrowRight, AlertCircle, User, Mail, Phone, Calendar, Award, TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import NotificationBell from "@/components/NotificationBell";

interface UnifiedNavbarProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export default function UnifiedNavbar({ cartCount = 0, onCartClick }: UnifiedNavbarProps) {
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    points: 0,
  });

  // Fetch user stats when dropdown opens
  useEffect(() => {
    if (userDropdownOpen && user) {
      fetchUserStats();
    }
  }, [userDropdownOpen, user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      const response = await fetch(`${API_BASE}/orders?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const orders = Array.isArray(result) ? result : result.data || [];
        
        // Calculate stats
        const totalOrders = orders.length;
        const completedOrders = orders.filter((o: any) => o.status === 'completed');
        const totalSpent = completedOrders.reduce((sum: number, o: any) => {
          const price = o.price || o.total_amount || o.unit_price || 0;
          return sum + price;
        }, 0);
        
        // Calculate points (1 point per 100 taka spent)
        const points = Math.floor(totalSpent / 100);

        setUserStats({
          totalOrders,
          totalSpent,
          points,
        });
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };



  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (userDropdownOpen && !target.closest('.profile-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    navigate("/login");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setUploadingAvatar(true);
    toast.info("Uploading avatar to ImgBB...");

    try {
      // Convert image to base64
      const reader = new FileReader();

      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;

      // ImgBB API Key
      const IMGBB_API_KEY = "cfdf8c24a5b1249d8b721f1d8adb63a8";

      const formData = new FormData();
      formData.append('image', base64Data);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ImgBB error:", errorText);
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.data.url) {
        throw new Error("Invalid response from ImgBB");
      }

      const avatarUrl = data.data.url;

      // Update user profile with new avatar URL
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const updateResponse = await fetch(`${API_BASE}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: avatarUrl }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update profile");
      }

      if (userData) {
        localStorage.setItem("user", JSON.stringify({ ...userData, avatar: avatarUrl }));
      }

      toast.success("Avatar uploaded successfully!");
      window.location.reload();
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      if (error.message.includes("Failed to fetch")) {
        toast.error("Network error! Check your internet connection");
      } else {
        toast.error(error.message || "Failed to upload avatar");
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Calculate user level based on actual spending
  const getUserLevel = () => {
    const totalSpent = userStats.totalSpent;
    if (totalSpent >= 50000) return { level: "Diamond", color: "from-cyan-500 to-blue-500", icon: "💎" };
    if (totalSpent >= 20000) return { level: "Gold", color: "from-yellow-500 to-orange-500", icon: "🏆" };
    if (totalSpent >= 10000) return { level: "Silver", color: "from-gray-400 to-gray-500", icon: "🥈" };
    return { level: "Bronze", color: "from-orange-600 to-red-600", icon: "🥉" };
  };

  const userLevel = getUserLevel();

  return (
    <>
      {/* Desktop Navbar - Hidden on Mobile */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 shadow-lg shadow-gray-200/50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Navbar */}
          <div className="h-20 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B30] to-red-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                  <img
                    src="/logo.jpg"
                    alt="NRX Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-[#FF3B30] group-hover:to-red-600 transition-all">
                  NRX Store
                </h1>
                <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                  <Sparkles size={10} className="text-[#FF3B30]" />
                  Premium Diamond Shop
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/" className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#FF3B30] hover:bg-red-50 rounded-xl transition-all">
                হোম
              </Link>
              <Link to="/store" className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#FF3B30] hover:bg-red-50 rounded-xl transition-all">
                কিনুন
              </Link>
              <Link to="/about" className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#FF3B30] hover:bg-red-50 rounded-xl transition-all">
                আমাদের সম্পর্কে
              </Link>
              <Link to="/faq" className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#FF3B30] hover:bg-red-50 rounded-xl transition-all">
                FAQ
              </Link>
              <Link to="/support" className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#FF3B30] hover:bg-red-50 rounded-xl transition-all flex items-center gap-1">
                <HeadphonesIcon size={16} />
                সাপোর্ট
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {/* Notifications */}
                  <NotificationBell />

                  {/* User Profile Dropdown */}
                  <div className="relative profile-dropdown-container">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-600 text-white hover:shadow-xl hover:shadow-slate-500/30 hover:scale-105 transition-all duration-300 border-2 border-slate-500 hover:border-slate-400">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center ring-2 ring-white/30">
                        {userData?.avatar ? (
                          <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-black">{userData?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-xs font-bold leading-none mb-1">{userData?.name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}</p>
                        <p className="text-[10px] text-gray-400 leading-none">{userLevel.icon} {userLevel.level}</p>
                      </div>
                      <ChevronDown size={16} className={`transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

                        {/* Profile Header */}
                        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-6 overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3B30]/20 rounded-full blur-3xl" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />

                          <div className="relative flex items-start gap-4">
                            <div className="relative">
                              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#FF3B30] to-red-600 flex items-center justify-center ring-4 ring-white/20 shadow-xl">
                                {userData?.avatar ? (
                                  <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-2xl font-black text-white">{userData?.name?.[0]?.toUpperCase() || 'U'}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-black text-white mb-1 truncate">{userData?.name || 'User'}</h3>
                              <p className="text-xs text-gray-400 mb-2 truncate flex items-center gap-1">
                                <Mail size={12} />
                                {user.email}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 bg-gradient-to-r ${userLevel.color} text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}>
                                  <span>{userLevel.icon}</span>
                                  {userLevel.level}
                                </span>
                                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold flex items-center gap-1 border border-green-500/30">
                                  <Zap size={12} />
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2 p-4 bg-gradient-to-br from-gray-50 to-white border-b-2 border-gray-100">
                          <div className="text-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <Package size={16} className="text-blue-500 mx-auto mb-1" />
                            <p className="text-xs font-black text-gray-900">{userStats.totalOrders}</p>
                            <p className="text-[10px] text-gray-500 font-semibold">Orders</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <TrendingUp size={16} className="text-green-500 mx-auto mb-1" />
                            <p className="text-xs font-black text-gray-900">৳{userStats.totalSpent.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-500 font-semibold">Spent</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <Award size={16} className="text-purple-500 mx-auto mb-1" />
                            <p className="text-xs font-black text-gray-900">{userStats.points}</p>
                            <p className="text-[10px] text-gray-500 font-semibold">Points</p>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <button onClick={() => { navigate("/dashboard"); setUserDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all group">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg group-hover:scale-110 transition-transform">
                              <LayoutDashboard size={16} className="text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-bold text-gray-900 group-hover:text-[#FF3B30]">ড্যাশবোর্ড</p>
                              <p className="text-xs text-gray-500">View your dashboard</p>
                            </div>
                            <ArrowRight size={16} className="text-gray-400 group-hover:text-[#FF3B30] group-hover:translate-x-1 transition-all" />
                          </button>

                          <button onClick={() => { navigate("/store"); setUserDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all group">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                              <Gift size={16} className="text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-bold text-gray-900 group-hover:text-[#FF3B30]">অর্ডার করুন</p>
                              <p className="text-xs text-gray-500">Browse products</p>
                            </div>
                            <ArrowRight size={16} className="text-gray-400 group-hover:text-[#FF3B30] group-hover:translate-x-1 transition-all" />
                          </button>

                          <button onClick={() => { navigate("/settings"); setUserDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all group">
                            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg group-hover:scale-110 transition-transform">
                              <Settings size={16} className="text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-bold text-gray-900 group-hover:text-[#FF3B30]">সেটিংস</p>
                              <p className="text-xs text-gray-500">Account settings</p>
                            </div>
                            <ArrowRight size={16} className="text-gray-400 group-hover:text-[#FF3B30] group-hover:translate-x-1 transition-all" />
                          </button>
                        </div>

                        {/* Logout */}
                        <div className="p-3 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-100">
                          <button onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 hover:from-red-600 hover:to-red-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg group">
                            <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                            লগআউট
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-900 text-gray-900 text-sm font-bold hover:bg-gray-900 hover:text-white transition-all">
                    <LogIn size={18} />
                    লগইন
                  </Link>
                  <Link to="/login?signup=true" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3B30] to-red-600 text-white text-sm font-bold hover:shadow-xl hover:scale-105 transition-all">
                    <UserPlus size={18} />
                    সাইন আপ
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar - Simplified */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="/logo.jpg"
                alt="NRX"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900">NRX Store</h1>
              <p className="text-[8px] text-gray-500 font-bold">Premium Shop</p>
            </div>
          </Link>

          {/* Right Actions */}
          {user && (
            <div className="flex items-center gap-2">
              {/* User Avatar */}
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#FF3B30] to-red-600 flex items-center justify-center ring-2 ring-gray-200">
                {userData?.avatar ? (
                  <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-black text-white">{userData?.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            {user && userData && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#FF3B30]/10 to-red-600/10 rounded-2xl border-2 border-[#FF3B30]/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF3B30] to-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                  {userData.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-600 truncate">{user.email}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700">
                <Sparkles size={20} className="text-[#FF3B30]" />
                হোম
              </Link>
              <Link to="/store" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700">
                <ShoppingCart size={20} className="text-[#FF3B30]" />
                কিনুন
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700">
                <Info size={20} className="text-[#FF3B30]" />
                আমাদের সম্পর্কে
              </Link>
              <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700">
                <HelpCircle size={20} className="text-[#FF3B30]" />
                FAQ
              </Link>
              {user && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700">
                    <LayoutDashboard size={20} className="text-[#FF3B30]" />
                    ড্যাশবোর্ড
                  </Link>
                  <button onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700 relative">
                    <Bell size={20} className="text-[#FF3B30]" />
                    নোটিফিকেশন
                    {unreadCount > 0 && (
                      <span className="ml-auto px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </>
              )}
              <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700">
                <HeadphonesIcon size={20} className="text-[#FF3B30]" />
                সাপোর্ট
              </Link>
            </div>

            {user ? (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
                  <Settings size={18} />
                  সেটিংস
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors">
                  <LogOut size={18} />
                  লগআউট
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-900 text-gray-900 font-bold text-sm hover:bg-gray-900 hover:text-white transition-colors">
                  <LogIn size={18} />
                  লগইন
                </Link>
                <Link to="/login?signup=true" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF3B30] text-white font-bold text-sm hover:bg-red-600 transition-colors">
                  <UserPlus size={18} />
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
