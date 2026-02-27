import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, CheckCircle, Calendar, MessageSquare, Home, RefreshCw, LogOut, Bell, Activity, Star, Menu, X, Sparkles, TrendingUp, DollarSign, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getAllOrders, getAllProducts, getSettings } from '@/lib/adminService';
import { SiteSettings } from '@/lib/settingsService';
import { Product, Order } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import OverviewTab from '@/components/admin/OverviewTab';
import OrdersTab from '@/components/admin/OrdersTab';
import ProductsTab from '@/components/admin/ProductsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import OrderVerificationTab from '@/components/admin/OrderVerificationTab';
import CalendarTab from '@/components/admin/CalendarTab';
import SupportMessagesTab from '@/components/admin/SupportMessagesTab';

type TabType = 'overview' | 'orders' | 'products' | 'settings' | 'verification' | 'calendar' | 'messages';

export default function AdminDashboardMobile() {
  const navigate = useNavigate();
  const { user, isAdmin, logout: authLogout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      toast.error('দয়া করে admin হিসেবে লগইন করুন');
      navigate('/admin');
      return;
    }
    loadData();
    setLoading(false);
  }, [user, isAdmin, authLoading, navigate]);

  const loadData = async () => {
    try {
      const [ordersData, productsData, settingsData] = await Promise.allSettled([
        getAllOrders(),
        getAllProducts(true),
        getSettings(),
      ]);
      
      if (ordersData.status === 'fulfilled' && Array.isArray(ordersData.value)) {
        const normalizedOrders = ordersData.value.map((order: any) => ({
          ...order,
          productName: order.product_name || order.productName || 'Unknown',
          price: order.total_amount || order.price || 0,
          createdAt: order.created_at || order.createdAt,
          verificationStatus: order.verification_status || order.verificationStatus || 'pending',
        }));
        setOrders(normalizedOrders);
      } else {
        setOrders([]);
      }
      
      if (productsData.status === 'fulfilled' && Array.isArray(productsData.value)) {
        setProducts(productsData.value);
      } else {
        setProducts([]);
      }
      
      if (settingsData.status === 'fulfilled' && settingsData.value) {
        setSettings(settingsData.value);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    toast.success('ডেটা রিফ্রেশ হয়েছে!');
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      toast.success('লগআউট সফল');
      navigate('/admin');
    } catch (error) {
      toast.error('লগআউট ব্যর্থ');
    }
  };

  useEffect(() => {
    if (!isAdmin || !user) return;
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [isAdmin, user]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt || Date.now()) >= today);
  
  const stats = {
    totalOrders: orders.length,
    todayOrders: todayOrders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.price || 0), 0),
    todayRevenue: todayOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.price || 0), 0),
    totalProducts: products.length,
    activeProducts: products.filter(p => p.isActive).length,
    pendingVerification: orders.filter(o => o.verificationStatus === 'pending').length,
  };

  const menuItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: Home, color: 'from-blue-500 to-cyan-500' },
    { id: 'orders', label: 'অর্ডার', icon: ShoppingCart, badge: stats.todayOrders, color: 'from-purple-500 to-pink-500' },
    { id: 'verification', label: 'ভেরিফাই', icon: CheckCircle, badge: stats.pendingVerification, color: 'from-orange-500 to-red-500' },
    { id: 'products', label: 'পণ্য', icon: Package, badge: stats.activeProducts, color: 'from-green-500 to-emerald-500' },
    { id: 'calendar', label: 'ক্যালেন্ডার', icon: Calendar, color: 'from-indigo-500 to-purple-500' },
    { id: 'messages', label: 'মেসেজ', icon: MessageSquare, color: 'from-pink-500 to-rose-500' },
  ];

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white font-bold text-lg">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMenu(true)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-95"
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-xl font-black flex items-center gap-2">
                  <Sparkles size={20} />
                  Admin Panel
                </h1>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <Activity size={10} />
                  Live Monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-95"
              >
                <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-95 relative">
                <Bell size={20} />
                {stats.pendingVerification > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-gray-900 rounded-full text-xs font-bold flex items-center justify-center">
                    {stats.pendingVerification}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-4 pb-4 grid grid-cols-4 gap-2">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center"
            >
              <TrendingUp size={20} className="mx-auto mb-1" />
              <p className="text-2xl font-black">{stats.todayOrders}</p>
              <p className="text-[9px] text-white/80 font-medium">আজকের অর্ডার</p>
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center"
            >
              <DollarSign size={20} className="mx-auto mb-1" />
              <p className="text-2xl font-black">৳{(stats.todayRevenue / 1000).toFixed(0)}k</p>
              <p className="text-[9px] text-white/80 font-medium">আজকের আয়</p>
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center"
            >
              <Clock size={20} className="mx-auto mb-1" />
              <p className="text-2xl font-black">{stats.pendingOrders}</p>
              <p className="text-[9px] text-white/80 font-medium">পেন্ডিং</p>
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center"
            >
              <Users size={20} className="mx-auto mb-1" />
              <p className="text-2xl font-black">{stats.activeProducts}</p>
              <p className="text-[9px] text-white/80 font-medium">পণ্য</p>
            </motion.div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <div className="flex px-2 py-2 gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all relative
                  ${activeTab === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 text-gray-700 active:scale-95'
                  }
                `}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === item.id ? 'bg-white/20' : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-[220px] pb-6 px-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && <OverviewTab orders={orders} products={products} />}
          {activeTab === 'orders' && <OrdersTab orders={orders} />}
          {activeTab === 'products' && <ProductsTab products={products} />}
          {activeTab === 'verification' && <OrderVerificationTab orders={orders} />}
          {activeTab === 'calendar' && <CalendarTab orders={orders} />}
          {activeTab === 'messages' && <SupportMessagesTab />}
          {activeTab === 'settings' && settings && <SettingsTab settings={settings} />}
        </motion.div>
      </div>

      {/* Side Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="font-black text-xl">NRX Admin</h2>
                    <p className="text-xs text-gray-400">Control Panel</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {user && (
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name || 'Admin'} className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500 shadow-lg" />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center font-black text-xl">
                        {user.name?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-lg">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl text-xs font-bold text-yellow-300 flex items-center gap-1">
                      <Star size={12} />
                      {user.role}
                    </span>
                    <span className="px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-xl text-xs font-bold text-green-300 flex items-center gap-1">
                      <Activity size={12} />
                      Active
                    </span>
                  </div>
                </div>
              )}

              <nav className="p-4">
                <p className="text-xs font-bold text-gray-400 mb-3 px-2">NAVIGATION</p>
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setActiveTab(item.id as TabType);
                      setShowMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all ${
                      activeTab === item.id
                        ? `bg-gradient-to-r ${item.color} shadow-lg scale-105`
                        : 'hover:bg-white/10 active:scale-95'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="flex-1 text-left font-bold">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        activeTab === item.id ? 'bg-white/20' : 'bg-red-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </nav>

              <div className="p-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all"
                >
                  <Package size={20} />
                  <span className="font-bold">সেটিংস</span>
                </button>
                <button
                  onClick={() => { navigate('/'); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all"
                >
                  <Home size={20} />
                  <span className="font-bold">হোম পেজ</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-red-500/20 transition-all text-red-400"
                >
                  <LogOut size={20} />
                  <span className="font-bold">লগআউট</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
