import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, Settings, ShoppingCart, Clock, CheckCircle,
  Calendar, DollarSign, Activity, ArrowUpRight, ArrowDownRight,
  RefreshCw, LogOut, Bell, Search, Menu,
  Home, Upload, MessageSquare, ChevronRight, Star, Zap, Sparkles
} from "lucide-react";
import { SiteSettings } from "@/lib/settingsService";
import { Product, Order } from "@/lib/types";
import OverviewTab from "@/components/admin/OverviewTab";
import OrdersTab from "@/components/admin/OrdersTab";
import ProductsTab from "@/components/admin/ProductsTab";
import SettingsTab from "@/components/admin/SettingsTab";
import OrderVerificationTab from "@/components/admin/OrderVerificationTab";
import CalendarTab from "@/components/admin/CalendarTab";
import SupportMessagesTab from "@/components/admin/SupportMessagesTab";
import AdminMobileNavBar from "@/components/admin/AdminMobileNavBar";
import AdminNotificationPanel from "@/components/admin/AdminNotificationPanel";
import { getAllOrders, getAllProducts, getSettings } from "@/lib/adminService";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminNotificationCount } from "@/hooks/useNotificationCount";

type TabType = "overview" | "orders" | "products" | "settings" | "verification" | "calendar" | "messages";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, logout: authLogout, loading: authLoading } = useAuth();
  const { unreadCount, refreshCount } = useAdminNotificationCount();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const [isMobile, setIsMobile] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true); // Auto-open on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide Sonner toaster on admin dashboard
  useEffect(() => {
    // Add CSS to hide toaster
    const style = document.createElement('style');
    style.id = 'admin-hide-toaster';
    style.innerHTML = `
      [data-sonner-toaster] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup on unmount
    return () => {
      const styleElement = document.getElementById('admin-hide-toaster');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      console.log("Admin: Image validation failed - not an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      console.log("Admin: Image validation failed - file too large");
      return;
    }

    setUploadingAvatar(true);
    console.log("Admin: Uploading avatar...");

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

      // Upload to ImgBB
      const IMGBB_API_KEY = "cfdf8c24a5b1249d8b721f1d8adb63a8";

      const formData = new FormData();
      formData.append('image', base64Data);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.data.url) {
        throw new Error("Invalid response from ImgBB");
      }

      const avatarUrl = data.data.url;

      // Update user in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const updatedUser = { ...JSON.parse(storedUser), avatar: avatarUrl };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      console.log("Admin: Avatar updated successfully!");
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      if (error.message.includes("Failed to fetch")) {
        console.error("Admin: Network error during avatar upload");
      } else {
        console.error("Admin: Avatar upload failed -", error.message);
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    // Check authentication
    if (authLoading) {
      console.log("Auth loading...");
      return;
    }

    console.log("Auth check:", { user, isAdmin, authLoading });

    if (!user || !isAdmin) {
      console.log("Not admin or not logged in, redirecting...");

      // Show notification for unauthorized access attempt
      if (user && !isAdmin) {
        // addNotification({
        //   title: "🚫 অ্যাক্সেস অস্বীকৃত",
        //   message: "আপনার এই পেজে প্রবেশের অনুমতি নেই। শুধুমাত্র অ্যাডমিন ইউজাররা এই ড্যাশবোর্ড ব্যবহার করতে পারবেন।",
        //   type: "error",
        //   link: "/"
        // });
        console.log("Admin: Unauthorized access attempt");
      } else {
        console.log("Admin: Login required");
      }

      navigate("/admin");
      return;
    }

    console.log("Admin authenticated, loading data...");
    // Load data
    loadData();
    setLoading(false);
  }, [user, isAdmin, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      await authLogout();
      console.log("Admin: Logged out successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const loadData = async () => {
    try {
      console.log("=== LOADING ADMIN DATA ===");
      console.log("Fetching orders, products, and settings...");

      // Fetch data with better error handling
      const [ordersData, productsData, settingsData] = await Promise.allSettled([
        getAllOrders(),
        getAllProducts(true),
        getSettings(),
      ]);

      // Handle orders
      if (ordersData.status === 'fulfilled' && Array.isArray(ordersData.value)) {
        console.log("Orders loaded:", ordersData.value.length);
        // Normalize orders to ensure all fields are present
        const normalizedOrders = ordersData.value.map((order: any) => ({
          ...order,
          // Ensure required fields with fallbacks
          productName: order.product_name || order.productName || "Unknown Product",
          gameName: order.game_name || order.gameName || "Unknown Game",
          userName: order.user_name || order.userName || order.display_name || "Unknown User",
          userEmail: order.user_email || order.contact_email || "Unknown",
          gameId: order.player_id || order.gameId || "",
          transactionId: order.transaction_id || order.transactionId || "",
          paymentMethod: order.payment_method || order.paymentMethod || "Unknown",
          paymentProofImage: order.payment_proof_url || order.paymentProofImage,
          phoneNumber: order.contact_phone || order.phoneNumber || "",
          verificationStatus: order.verification_status || order.verificationStatus || "pending",
          verificationNotes: order.verification_notes || order.verificationNotes || "",
          price: order.total_amount || order.price || 0,
          diamonds: order.diamonds || 0,
          createdAt: order.created_at || order.createdAt,
          orderNumber: order.orderNumber || order.id.slice(0, 8).toUpperCase(),
        }));

        // Track order counts for statistics
        const pendingCount = normalizedOrders.filter((o: any) => o.verificationStatus === "pending").length;
        
        setOrders(normalizedOrders);
      } else {
        console.warn("Failed to load orders:", ordersData.status === 'rejected' ? ordersData.reason : 'Invalid data');
        setOrders([]);
      }

      // Handle products
      if (productsData.status === 'fulfilled' && Array.isArray(productsData.value)) {
        console.log("Products loaded:", productsData.value.length);
        setProducts(productsData.value);
      } else {
        console.warn("Failed to load products:", productsData.status === 'rejected' ? productsData.reason : 'Invalid data');
        setProducts([]);
      }

      // Handle settings
      if (settingsData.status === 'fulfilled' && settingsData.value) {
        console.log("Settings loaded: Yes");
        setSettings(settingsData.value);
      } else {
        console.warn("Failed to load settings, using defaults");
        setSettings({
          adminEmails: ["gunjonarka@gmail.com"],
          paymentMethods: {
            bkash: { number: "+8801883800356", type: "Send Money", logo: "", enabled: true },
            nagad: { number: "+8801883800356", type: "Send Money", logo: "", enabled: true },
            rocket: { number: "+8801580831611", type: "Send Money", logo: "", enabled: true },
          },
          siteName: "NRX Store",
          siteNameBn: "এনআরএক্স স্টোর",
          supportWhatsapp: "+8801883800356",
          supportEmail: "support@nrxstore.com",
          maintenanceMode: false,
          announcementBanner: { enabled: false, message: "", messageBn: "", type: "info" },
        });
      }

      console.log("=== ADMIN DATA LOADED SUCCESSFULLY ===");
    } catch (error) {
      console.error("=== ERROR LOADING ADMIN DATA ===");
      console.error("Error:", error);

      // Set default values even on error
      setOrders([]);
      setProducts([]);
      setSettings({
        adminEmails: ["gunjonarka@gmail.com"],
        paymentMethods: {
          bkash: { number: "+8801883800356", type: "Send Money", logo: "", enabled: true },
          nagad: { number: "+8801883800356", type: "Send Money", logo: "", enabled: true },
          rocket: { number: "+8801580831611", type: "Send Money", logo: "", enabled: true },
        },
        siteName: "NRX Store",
        siteNameBn: "এনআরএক্স স্টোর",
        supportWhatsapp: "+8801883800356",
        supportEmail: "support@nrxstore.com",
        maintenanceMode: false,
        announcementBanner: { enabled: false, message: "", messageBn: "", type: "info" },
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    console.log("Admin: Data refreshed successfully");
    setRefreshing(false);
  };

  useEffect(() => {
    if (!isAdmin || !user) return;
    const interval = setInterval(() => {
      loadData();
    }, 10000);
    return () => clearInterval(interval);
  }, [isAdmin, user]);

  // Calculate statistics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter(o => new Date(o.createdAt || o.created_at || Date.now()) >= today);
  const yesterdayStart = new Date(today);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt || o.created_at || Date.now());
    return orderDate >= yesterdayStart && orderDate < today;
  });

  const todayRevenue = todayOrders.filter(o => o.status === "completed").reduce((sum, o) => sum + (o.price || 0), 0);
  const yesterdayRevenue = yesterdayOrders.filter(o => o.status === "completed").reduce((sum, o) => sum + (o.price || 0), 0);
  const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100) : 0;

  const stats = {
    totalOrders: orders.length,
    todayOrders: todayOrders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    completedOrders: orders.filter(o => o.status === "completed").length,
    totalRevenue: orders.filter(o => o.status === "completed").reduce((sum, o) => sum + (o.price || 0), 0),
    todayRevenue,
    revenueChange,
    totalProducts: products.length,
    activeProducts: products.filter(p => p.isActive).length,
    pendingVerification: orders.filter(o => o.verificationStatus === "pending").length,
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-[#FF3B30]/20 border-t-[#FF3B30] rounded-full animate-spin mx-auto mb-6" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FF3B30] animate-pulse" size={32} />
          </div>
          <p className="text-white font-bold text-xl mb-2">Loading Admin Dashboard...</p>
          <p className="text-gray-400 text-sm">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  if (!isAdmin || !user) {
    return null;
  }

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, badge: null },
    { id: "orders", label: "Orders", icon: ShoppingCart, badge: stats.todayOrders },
    { id: "verification", label: "Verification", icon: CheckCircle, badge: stats.pendingVerification },
    { id: "products", label: "Products", icon: Package, badge: stats.activeProducts },
    { id: "calendar", label: "Calendar", icon: Calendar, badge: null },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: null },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex ${isMobile ? 'flex-col' : ''}`}>
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 z-40 ${sidebarOpen ? 'w-72' : isMobile ? '-translate-x-full' : 'w-20'
        }`}>
        {/* User Info - Expanded */}
        {sidebarOpen && user && (
          <div className={`p-6 border-b border-white/10 ${isMobile ? 'pt-20' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative group">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'Admin'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500 shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${user.avatar ? 'hidden' : ''
                    }`}
                >
                  {user.name?.charAt(0) || 'A'}
                </div>

                {/* Upload Avatar Button */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Change avatar"
                >
                  {uploadingAvatar ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload size={16} className="text-white" />
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </div>

              <div className="flex-1">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg text-xs font-semibold text-yellow-300 flex items-center gap-1">
                <Star size={12} />
                {user.role}
              </span>
              <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-xs font-semibold text-green-300 flex items-center gap-1">
                <Zap size={12} />
                Active
              </span>
            </div>
          </div>
        )}

        {/* User Info - Collapsed */}
        {!sidebarOpen && user && (
          <div className={`p-3 border-b border-white/10 flex justify-center ${isMobile ? 'pt-20' : ''}`}>
            <div className="relative group">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'Admin'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-500 shadow-lg hover:scale-110 transition-transform cursor-pointer"
                  title={user.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div
                className={`w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-sm shadow-lg hover:scale-110 transition-transform cursor-pointer ${user.avatar ? 'hidden' : ''
                  }`}
                title={user.name}
              >
                {user.name?.charAt(0) || 'A'}
              </div>

              {/* Upload Avatar Button - Collapsed */}
              <label
                htmlFor="avatar-upload-collapsed"
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Change avatar"
              >
                {uploadingAvatar ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload size={14} className="text-white" />
                )}
              </label>
              <input
                id="avatar-upload-collapsed"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploadingAvatar}
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all group ${activeTab === item.id
                  ? 'bg-gradient-to-r from-[#FF3B30] to-red-600 shadow-lg shadow-red-500/50'
                  : 'hover:bg-white/10'
                }`}
            >
              <item.icon size={20} className={activeTab === item.id ? '' : 'group-hover:scale-110 transition-transform'} />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left font-semibold">{item.label}</span>
                  {item.badge !== null && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === item.id
                        ? 'bg-white/20'
                        : 'bg-[#FF3B30] text-white'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Notifications Button */}
          <button
            onClick={() => {
              if (isMobile) {
                navigate('/admin-notifications');
              } else {
                setShowNotificationPanel(!showNotificationPanel);
              }
              refreshCount(); // Refresh count when opening
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl group relative"
          >
            <Bell size={20} className="group-hover:scale-110 transition-transform" />
            {sidebarOpen && (
              <>
                <span className="flex-1 text-left font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20">
                    {unreadCount}
                  </span>
                )}
              </>
            )}
            {!sidebarOpen && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-gray-900 rounded-full text-xs font-bold flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeTab === "settings"
                ? 'bg-gradient-to-r from-[#FF3B30] to-red-600 shadow-lg shadow-red-500/50'
                : 'hover:bg-white/10'
              }`}
          >
            <Settings size={20} className={activeTab === "settings" ? '' : 'group-hover:scale-110 transition-transform'} />
            {sidebarOpen && <span className="flex-1 text-left font-semibold">Settings</span>}
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            {sidebarOpen && <span className="font-semibold">Refresh Data</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all text-red-400"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isMobile ? 'ml-0 h-screen overflow-hidden flex flex-col' : sidebarOpen ? 'ml-72' : 'ml-20'
        }`}>
        {/* Top Bar */}
        <header className={`flex-shrink-0 z-50 ${isMobile
            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-lg'
            : 'sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200'
          }`}>
          <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`lg:hidden p-2 rounded-xl transition-colors ${isMobile ? 'hover:bg-white/20' : 'hover:bg-gray-100'
                  }`}
              >
                <Menu size={24} className={isMobile ? 'text-white' : 'text-gray-700'} />
              </button>

              <div>
                <h1 className={`text-lg sm:text-2xl font-black flex items-center gap-2 ${isMobile ? 'text-white' : 'text-gray-900'
                  }`}>
                  <Sparkles className={isMobile ? 'text-white' : 'text-[#FF3B30]'} size={20} />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                  <span className="sm:hidden">Admin Dashboard</span>
                </h1>
                <p className={`text-[10px] sm:text-sm flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1 ${isMobile ? 'text-white/80' : 'text-gray-600'
                  }`}>
                  <Activity size={10} className={isMobile ? 'text-white' : 'text-green-500'} />
                  <span className="hidden sm:inline">Real-time monitoring • Last updated: {new Date().toLocaleTimeString()}</span>
                  <span className="sm:hidden">Live • Last updated: {new Date().toLocaleTimeString()}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  if (isMobile) {
                    navigate('/admin-notifications');
                  } else {
                    setShowNotificationPanel(!showNotificationPanel);
                  }
                  refreshCount(); // Refresh count when opening
                }}
                className={`p-2 sm:p-3 rounded-xl transition-colors relative ${isMobile ? 'hover:bg-white/20' : 'hover:bg-gray-100'
                  }`}
              >
                <Bell size={18} className={isMobile ? 'text-white' : 'text-gray-700'} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-gray-900 rounded-full text-xs font-bold flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              <button className={`hidden sm:block p-2 sm:p-3 rounded-xl transition-colors ${isMobile ? 'hover:bg-white/20' : 'hover:bg-gray-100'
                }`}>
                <Search size={18} className={isMobile ? 'text-white' : 'text-gray-700'} />
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className={`flex-1 overflow-y-auto smooth-scroll ${isMobile ? 'p-3 pb-20' : 'p-3 sm:p-6 lg:p-8'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
            {/* Revenue Card */}
            <div className="group relative bg-gradient-to-br from-[#FF3B30] via-red-500 to-red-600 rounded-2xl p-5 sm:p-6 text-white shadow-xl hover:shadow-2xl transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-black/10 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold text-xs sm:text-sm ${revenueChange >= 0 ? 'bg-green-500/30' : 'bg-red-500/30'
                    }`}>
                    {revenueChange >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(revenueChange).toFixed(1)}%
                  </div>
                </div>
                <p className="text-white/80 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Total Revenue</p>
                <p className="text-3xl sm:text-4xl font-black mb-2 sm:mb-3">৳{stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-white/70">Today: ৳{stats.todayRevenue.toLocaleString()}</span>
                  <ChevronRight size={14} className="text-white/50" />
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="group relative bg-white rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                    <ShoppingCart size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                    {stats.todayOrders} Today
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Total Orders</p>
                <p className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 sm:mb-3">{stats.totalOrders}</p>
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                  <span>Completed: {stats.completedOrders}</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>

            {/* Pending Card */}
            <div className="group relative bg-white rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-yellow-200">
                    <Clock size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  {stats.pendingVerification > 0 && (
                    <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-bold animate-pulse">
                      {stats.pendingVerification} Action
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Pending Orders</p>
                <p className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 sm:mb-3">{stats.pendingOrders}</p>
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                  <span>Verification: {stats.pendingVerification}</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="group relative bg-white rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-purple-200">
                    <Package size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                    {stats.activeProducts} Active
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Total Products</p>
                <p className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 sm:mb-3">{stats.totalProducts}</p>
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                  <span>All categories</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-3 sm:p-6 lg:p-8">
              {activeTab === "overview" && <OverviewTab orders={orders} products={products} />}
              {activeTab === "calendar" && <CalendarTab orders={orders} />}
              {activeTab === "orders" && <OrdersTab orders={orders} />}
              {activeTab === "verification" && <OrderVerificationTab orders={orders} onVerificationComplete={loadData} />}
              {activeTab === "messages" && <SupportMessagesTab />}
              {activeTab === "products" && <ProductsTab products={products} onProductsChange={loadData} />}
              {activeTab === "settings" && <SettingsTab settings={settings} />}
            </div>
          </div>
        </div>
      </main>

      {/* Admin Mobile Navigation Bar */}
      {isMobile && (
        <AdminMobileNavBar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab as TabType);
            setSidebarOpen(false);
          }}
          stats={{
            todayOrders: stats.todayOrders,
            pendingVerification: stats.pendingVerification,
            activeProducts: stats.activeProducts,
          }}
        />
      )}

      {/* Admin Notification Panel - Desktop Only */}
      {!isMobile && (
        <AdminNotificationPanel
          isOpen={showNotificationPanel}
          onClose={() => setShowNotificationPanel(false)}
        />
      )}
    </div>
  );
}
