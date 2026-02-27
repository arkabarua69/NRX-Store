import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, Clock, CheckCircle, XCircle, User, Mail, Calendar,
  TrendingUp, Settings, Bell, Award, Star, Zap,
  ShoppingBag, CreditCard, Gift, Target, Activity, Eye,
  Download, Filter, Search, ChevronRight, Sparkles, Heart, RefreshCw, FileText
} from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import InvoiceView from "@/components/invoice/InvoiceView";
import { useAuth } from "@/contexts/AuthContext";
import { Order } from "@/lib/types";
import { format } from "date-fns";
import Footer from "@/components/ui/Footer";
import { API_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadOrders();

    // Real-time polling every 5 seconds
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/orders?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Orders API response:', result);

        // Handle multiple response formats:
        // 1. Direct array: [...]
        // 2. Object with data: { success: true, data: [...] }
        // 3. Paginated: { data: [...], page: 1, ... }
        let rawData = [];

        if (Array.isArray(result)) {
          rawData = result;
        } else if (result.data && Array.isArray(result.data)) {
          rawData = result.data;
        } else if (result.success && result.data && Array.isArray(result.data)) {
          rawData = result.data;
        }

        // Map database fields to frontend Order type
        const mappedOrders = rawData.map((order: any) => ({
          ...order,
          productName: order.productName || order.topup_packages?.name || 'Unknown Product',
          diamonds: order.diamonds || order.topup_packages?.diamonds || 0,
          gameId: order.gameId || order.player_id || '',
          transactionId: order.transactionId || order.transaction_id || '',
          paymentMethod: order.paymentMethod || order.payment_method || '',
          verificationStatus: order.verificationStatus || order.verification_status || 'pending',
          adminNotes: order.adminNotes || order.admin_notes || '',
          createdAt: order.createdAt || order.created_at || new Date().toISOString(),
          price: order.price || order.total_amount || order.unit_price || 0,
        }));

        setOrders(mappedOrders);
        setLastUpdate(new Date());
      } else {
        console.error('Orders API failed:', response.status);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("আপনি কি নিশ্চিত এই অর্ডার বাতিল করতে চান?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Try the cancel endpoint first
      let response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // If 404, try the status endpoint as fallback
      if (response.status === 404) {
        console.log("Cancel endpoint not found, trying status endpoint...");
        response = await fetch(`${API_URL}/orders/${orderId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "cancelled",
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cancel failed:", response.status, errorText);
        toast({
          title: "ব্যর্থ!",
          description: "অর্ডার বাতিল করতে ব্যর্থ হয়েছে",
          variant: "destructive",
        });
        return;
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "সফল!",
          description: "অর্ডার বাতিল করা হয়েছে",
        });
        loadOrders(); // Reload orders
      } else {
        toast({
          title: "ব্যর্থ!",
          description: result.message || "অর্ডার বাতিল করতে ব্যর্থ",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "ত্রুটি!",
        description: "অর্ডার বাতিল করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "all" ? true :
        activeTab === "pending" ? (order.status === "pending" || order.status === "processing") :
          activeTab === "completed" ? order.status === "completed" :
            activeTab === "cancelled" ? (order.status === "cancelled" || order.status === "failed") :
              true;

    const matchesSearch = searchQuery === "" ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.gameId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending" || o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled" || o.status === "failed").length,
    totalSpent: orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.price, 0),
    totalDiamonds: orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.diamonds, 0),
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed": return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "processing": return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      case "pending": return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case "failed": return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "cancelled": return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle size={16} />;
      case "processing": return <Clock size={16} className="animate-spin" />;
      case "pending": return <Clock size={16} />;
      case "failed": return <XCircle size={16} />;
      case "cancelled": return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  // Calculate user level based on total spent
  const getUserLevel = () => {
    if (stats.totalSpent >= 50000) return { level: "Diamond", color: "from-cyan-500 to-blue-500", icon: "💎" };
    if (stats.totalSpent >= 20000) return { level: "Gold", color: "from-yellow-500 to-orange-500", icon: "🏆" };
    if (stats.totalSpent >= 10000) return { level: "Silver", color: "from-gray-400 to-gray-500", icon: "🥈" };
    return { level: "Bronze", color: "from-orange-600 to-red-600", icon: "🥉" };
  };

  const userLevel = getUserLevel();

  // Show loading state instead of blank screen
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">লোড হচ্ছে...</h2>
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <UnifiedNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 mb-2 flex items-center gap-3">
                <Sparkles className="text-purple-600" size={36} />
                আমার ড্যাশবোর্ড
              </h1>
              <p className="text-gray-700 font-bold flex items-center gap-2">
                <Activity size={16} className="text-green-500 animate-pulse" />
                Welcome back, {userData.name}!
              </p>
            </div>

            {/* Real-time Indicator */}
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-xl px-4 py-2 shadow-lg border border-gray-200 flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-500 uppercase">Live</p>
                  <p className="text-xs text-gray-600">{format(lastUpdate, "HH:mm:ss")}</p>
                </div>
              </div>

              <button
                onClick={loadOrders}
                className="p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all hover:shadow-lg"
                title="Refresh"
              >
                <RefreshCw size={20} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 shadow-2xl border-2 border-white/20 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-white/30">
                  {userData?.avatar ? (
                    <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-black text-white drop-shadow-lg">{userData.name}</h2>
                  <span className={`px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg border-2 border-white/30`}>
                    <span>{userLevel.icon}</span>
                    {userLevel.level}
                  </span>
                </div>
                <p className="text-white/90 flex items-center gap-2 mb-3 drop-shadow">
                  <Mail size={16} /> {userData.email}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-bold flex items-center gap-1 border border-white/30">
                    <Zap size={12} />
                    Active Member
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-bold flex items-center gap-1 border border-white/30">
                    <Calendar size={12} />
                    Joined {format(new Date(userData.createdAt || Date.now()), "MMM yyyy")}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/settings")}
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl border border-white/30 transition-all hover:shadow-lg"
                  title="Settings"
                >
                  <Settings size={20} className="text-white" />
                </button>
                <button
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl border border-white/30 transition-all hover:shadow-lg relative"
                  title="Notifications"
                >
                  <Bell size={20} className="text-white" />
                  {stats.pending > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {stats.pending}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 hover:shadow-2xl transition-all group hover:scale-105">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Package size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase">Total</span>
                </div>
                <p className="text-3xl font-black text-gray-900">{stats.total}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 border-2 border-white/50 hover:shadow-2xl transition-all group hover:scale-105">
                <div className="flex items-center gap-2 text-white mb-2">
                  <Clock size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase">Pending</span>
                </div>
                <p className="text-3xl font-black text-white drop-shadow-lg">{stats.pending}</p>
              </div>

              <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-4 border-2 border-white/50 hover:shadow-2xl transition-all group hover:scale-105">
                <div className="flex items-center gap-2 text-white mb-2">
                  <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase">Done</span>
                </div>
                <p className="text-3xl font-black text-white drop-shadow-lg">{stats.completed}</p>
              </div>

              <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-4 border-2 border-white/50 hover:shadow-2xl transition-all group hover:scale-105">
                <div className="flex items-center gap-2 text-white mb-2">
                  <XCircle size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase">Cancel</span>
                </div>
                <p className="text-3xl font-black text-white drop-shadow-lg">{stats.cancelled}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-4 border-2 border-white/50 hover:shadow-2xl transition-all group hover:scale-105">
                <div className="flex items-center gap-2 text-white mb-2">
                  <TrendingUp size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase">Spent</span>
                </div>
                <p className="text-2xl font-black text-white drop-shadow-lg">৳{stats.totalSpent.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl p-4 border-2 border-white/50 hover:shadow-2xl transition-all group hover:scale-105">
                <div className="flex items-center gap-2 text-white mb-2">
                  <Award size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase">Diamonds</span>
                </div>
                <p className="text-2xl font-black text-white drop-shadow-lg">{stats.totalDiamonds.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <ShoppingBag size={28} />
                  অর্ডার হিস্ট্রি
                </h3>
                <p className="text-gray-400 text-sm mt-1">Order History & Tracking</p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3B30] w-full md:w-64"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b-2 border-purple-200 px-6 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { id: "all", label: "সব (All)", count: stats.total },
                { id: "pending", label: "পেন্ডিং (Pending)", count: stats.pending },
                { id: "completed", label: "সম্পন্ন (Done)", count: stats.completed },
                { id: "cancelled", label: "বাতিল (Cancel)", count: stats.cancelled },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-6 font-bold text-sm transition-all border-b-4 whitespace-nowrap relative ${activeTab === tab.id
                      ? "border-purple-600 text-purple-600 bg-white shadow-lg"
                      : "border-transparent text-gray-600 hover:text-purple-600 hover:bg-white/50"
                    }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-gray-200 text-gray-700"
                      }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-300" />
                </div>
                <p className="text-2xl font-black text-gray-400 mb-2">কোনো অর্ডার নেই</p>
                <p className="text-gray-500 mb-8">No orders found {searchQuery && `for "${searchQuery}"`}</p>
                <button
                  onClick={() => navigate("/store")}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-300 hover:scale-105 transition-all"
                >
                  স্টোরে যান - Go to Store
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 flex flex-col"
                  >
                    {/* Gradient Top Bar */}
                    <div className={`h-2 ${getStatusColor(order.status)}`} />

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Header: Status & Date */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                          <Calendar size={12} />
                          {format(new Date(order.createdAt), "dd MMM")}
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-base font-black text-gray-900 mb-4 line-clamp-2 min-h-[3rem] group-hover:text-purple-600 transition-colors">
                        {order.productName}
                      </h3>

                      {/* Order Info Grid - 2x2 */}
                      <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-3 border border-cyan-100">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-base">💎</span>
                            <span className="text-xs text-gray-600 font-semibold">Diamonds</span>
                          </div>
                          <p className="text-lg font-black text-cyan-700">{order.diamonds.toLocaleString()}</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-base">💰</span>
                            <span className="text-xs text-gray-600 font-semibold">Amount</span>
                          </div>
                          <p className="text-lg font-black text-purple-700">৳{order.price.toLocaleString()}</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100 col-span-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">🎮</span>
                              <span className="text-xs text-gray-600 font-semibold">Game ID</span>
                            </div>
                            <span className="font-bold text-green-700 text-sm">{order.gameId}</span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-3 border border-orange-100 col-span-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">💳</span>
                              <span className="text-xs text-gray-600 font-semibold">Payment</span>
                            </div>
                            <span className="font-bold text-orange-700 text-sm uppercase">{order.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Notes */}
                      {order.adminNotes && (
                        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                          <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1">
                            <Bell size={12} />
                            Admin Note:
                          </p>
                          <p className="text-xs text-blue-900 font-medium line-clamp-2">{order.adminNotes}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-auto">
                        {/* Show Invoice button only for non-cancelled orders */}
                        {order.status !== "cancelled" && order.status !== "failed" && (
                          <button
                            onClick={() => navigate(`/invoice/${order.id}`)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105"
                          >
                            <FileText size={16} />
                            Invoice
                          </button>
                        )}

                        {(order.status === "pending" || order.status === "processing") && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            title="Cancel Order"
                          >
                            <XCircle size={16} />
                          </button>
                        )}

                        {/* Show message for cancelled/failed orders */}
                        {(order.status === "cancelled" || order.status === "failed") && (
                          <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm">
                            <XCircle size={16} />
                            {order.status === "cancelled" ? "বাতিল করা হয়েছে" : "ব্যর্থ হয়েছে"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceView order={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
}
