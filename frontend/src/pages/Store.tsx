import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, Star, Crown, Zap, Diamond, Filter, Search, 
  Package, Eye, Users, Sparkles, BadgeCheck, Clock, 
  Shield, Truck, Award, X, SlidersHorizontal, TrendingUp, 
  Gift, Percent, ArrowRight, Tag, CheckCircle, Rocket,
  Flame, Target, ThumbsUp, MessageCircle,
  AlertCircle, Info, Headphones, CreditCard, RefreshCw, Gamepad2
} from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/lib/types";
import { subscribeToProducts } from "@/lib/productService";
import { getAllReviews, Review } from "@/lib/reviewService";
import ReviewModal from "@/components/ReviewModal";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/ui/Footer";
import { toast } from "@/hooks/use-toast";

const categories = [
  { id: "all", name: "সব প্যাকেজ", icon: Diamond, color: "bg-gradient-to-r from-red-500 to-pink-500" },
  { id: "budget", name: "বাজেট প্যাক", icon: Sparkles, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
  { id: "standard", name: "জনপ্রিয়", icon: Star, color: "bg-gradient-to-r from-yellow-500 to-orange-500" },
  { id: "premium", name: "বিগ প্যাক", icon: Flame, color: "bg-gradient-to-r from-red-600 to-orange-600" },
  { id: "membership", name: "মেম্বারশিপ", icon: Crown, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
];

export default function Store() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { cart, cartOpen, addToCart, updateQuantity, removeFromCart, closeCart, openCart, cartCount } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGame, setSelectedGame] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "newest">("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [availableGames, setAvailableGames] = useState<string[]>([]);
  
  // Dynamic stats - real-time from API
  const [stats, setStats] = useState({
    totalCustomers: 10000,
    totalOrders: 50000,
    avgDelivery: 8,
    rating: 4.9
  });

  useEffect(() => {
    const unsubscribe = subscribeToProducts((newProducts) => {
      console.log('Products received:', newProducts);
      setProducts(newProducts);
      
      // Extract unique game names
      const games = Array.from(new Set(newProducts.map(p => p.gameName).filter((name): name is string => Boolean(name))));
      setAvailableGames(games);
    });
    
    // Fetch platform stats
    fetchPlatformStats();
    
    return () => {
      unsubscribe();
    };
  }, []);

  const fetchPlatformStats = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_BASE}/stats/platform-stats`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setStats({
            totalCustomers: result.data.active_users,
            totalOrders: result.data.successful_orders,
            avgDelivery: result.data.avg_delivery_minutes,
            rating: result.data.avg_rating,
          });
          console.log('✅ Store stats fetched:', result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching store stats:', error);
      // Keep default values on error
    }
  };

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 100000) return `${Math.floor(num / 1000)}K+`;
    if (num >= 10000) return `${Math.floor(num / 1000)}K+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Fetch reviews
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const data = await getAllReviews();
    setReviews(data);
  };

  const filteredProducts = products
    .filter(p => selectedCategory === "all" || p.category === selectedCategory)
    .filter(p => selectedGame === "all" || p.gameName === selectedGame)
    .filter(p => {
      const name = p.name || '';
      const nameBn = p.nameBn || p.name_bn || '';
      const query = searchQuery.toLowerCase();
      return searchQuery === "" || name.toLowerCase().includes(query) || nameBn.includes(searchQuery);
    })
    .filter(p => {
      const price = p.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return (a.price || 0) - (b.price || 0);
        case "price-high": return (b.price || 0) - (a.price || 0);
        case "newest": {
          const aDate = new Date(a.createdAt || a.created_at || 0).getTime();
          const bDate = new Date(b.createdAt || b.created_at || 0).getTime();
          return bDate - aDate;
        }
        default: {
          const aSold = a.soldCount || a.sold_count || 0;
          const bSold = b.soldCount || b.sold_count || 0;
          return bSold - aSold;
        }
      }
    });

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "কার্ট খালি!",
        description: "প্রথমে কার্টে পণ্য যোগ করুন",
        variant: "destructive",
      });
      return;
    }
    navigate("/checkout", { state: { cart } });
  };

  const trendingProducts = products.filter(p => ((p.soldCount || 0) > 50)).slice(0, 4);
  const bestSellers = products.sort((a, b) => ((b.soldCount || 0) - (a.soldCount || 0))).slice(0, 3);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Ultra Modern with Animations - Fully Mobile Responsive */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-pink-500 to-purple-600">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-white/10 rounded-full blur-3xl -ml-24 sm:-ml-32 lg:-ml-48 -mt-24 sm:-mt-32 lg:-mt-48 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-64 sm:w-80 lg:w-[500px] h-64 sm:h-80 lg:h-[500px] bg-white/10 rounded-full blur-3xl -mr-32 sm:-mr-40 lg:-mr-64 -mb-32 sm:-mb-40 lg:-mb-64 animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Floating Icons - Hidden on mobile */}
          <div className="hidden lg:block absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
            <Diamond size={32} className="text-white/30" />
          </div>
          <div className="hidden lg:block absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
            <Sparkles size={28} className="text-yellow-300/40" />
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 pt-6 sm:pt-8 lg:pt-32 pb-6 sm:pb-8 lg:pb-20">
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-md text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-full font-black text-[10px] sm:text-xs lg:text-sm mb-3 sm:mb-4 lg:mb-8 shadow-2xl border-2 border-white/30 animate-pulse">
              <Flame size={14} className="sm:w-4 sm:h-4 animate-bounce" />
              <span className="whitespace-nowrap">বিশেষ অফার চলছে - ১০% ছাড়!</span>
              <Sparkles size={14} className="sm:w-4 sm:h-4 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            
            {/* Main Title with Gradient */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-white mb-3 sm:mb-4 lg:mb-6 leading-tight drop-shadow-2xl px-2">
              NRX <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 animate-pulse">Diamond</span> Store
            </h1>
            
            <p className="text-xs sm:text-sm md:text-xl lg:text-2xl text-white/90 mb-4 sm:mb-6 lg:mb-10 max-w-3xl mx-auto font-bold drop-shadow-lg px-4">
              <Rocket size={16} className="inline-block mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" /> সবচেয়ে কম দামে, সবচেয়ে দ্রুত ডেলিভারি
            </p>
            
            {/* Feature Pills - Fully Responsive Grid */}
            <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center justify-center gap-2 lg:gap-4 mb-4 sm:mb-6 lg:mb-10 px-2">
              <div className="group flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm px-2 sm:px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl transition-all hover:scale-110 cursor-pointer">
                <div className="p-0.5 sm:p-1 bg-green-500 rounded-full pointer-events-none">
                  <BadgeCheck size={12} className="sm:w-3.5 sm:h-3.5 text-white pointer-events-none" />
                </div>
                <span className="text-gray-900 font-black text-[10px] sm:text-xs lg:text-sm pointer-events-none whitespace-nowrap">১০০% নিরাপদ</span>
              </div>
              <div className="group flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm px-2 sm:px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl transition-all hover:scale-110 cursor-pointer">
                <div className="p-0.5 sm:p-1 bg-blue-500 rounded-full pointer-events-none">
                  <Rocket size={12} className="sm:w-3.5 sm:h-3.5 text-white pointer-events-none" />
                </div>
                <span className="text-gray-900 font-black text-[10px] sm:text-xs lg:text-sm pointer-events-none whitespace-nowrap">৫-১৫ মিনিট</span>
              </div>
              <div className="group flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm px-2 sm:px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl transition-all hover:scale-110 cursor-pointer">
                <div className="p-0.5 sm:p-1 bg-purple-500 rounded-full pointer-events-none">
                  <Users size={12} className="sm:w-3.5 sm:h-3.5 text-white pointer-events-none" />
                </div>
                <span className="text-gray-900 font-black text-[10px] sm:text-xs lg:text-sm pointer-events-none whitespace-nowrap">{stats.totalCustomers.toLocaleString()}+ গ্রাহক</span>
              </div>
              <div className="group flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm px-2 sm:px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl transition-all hover:scale-110 cursor-pointer">
                <div className="p-0.5 sm:p-1 bg-yellow-500 rounded-full pointer-events-none">
                  <Star size={12} className="sm:w-3.5 sm:h-3.5 text-white fill-white pointer-events-none" />
                </div>
                <span className="text-gray-900 font-black text-[10px] sm:text-xs lg:text-sm pointer-events-none whitespace-nowrap">{stats.rating}/৫ রেটিং</span>
              </div>
            </div>

            {/* CTA Buttons - Fully Mobile Responsive */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 lg:gap-4 px-4">
              <button 
                onClick={() => {
                  const section = document.getElementById('products-section');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="w-full sm:w-auto group flex items-center justify-center gap-2 lg:gap-3 bg-white text-red-500 px-4 sm:px-6 lg:px-8 py-3 lg:py-4 rounded-full font-black text-sm lg:text-lg shadow-2xl transition-all transform hover:scale-110 hover:-translate-y-1 hover:shadow-3xl cursor-pointer"
              >
                <ShoppingCart size={18} className="sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform pointer-events-none" />
                <span className="pointer-events-none">এখনই কিনুন</span>
                <ArrowRight size={18} className="sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform pointer-events-none" />
              </button>
              <button 
                onClick={() => {
                  if (userData) {
                    navigate('/dashboard');
                  } else {
                    toast({
                      title: "প্রথমে লগইন করুন!",
                      variant: "destructive",
                    });
                    navigate('/login');
                  }
                }}
                className="w-full sm:w-auto group flex items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md text-white px-4 sm:px-6 lg:px-8 py-3 lg:py-4 rounded-full font-black text-sm lg:text-lg border-2 border-white/50 transition-all transform hover:scale-110 hover:bg-white/20 cursor-pointer"
              >
                <Package size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform pointer-events-none" />
                <span className="pointer-events-none">আমার অর্ডার</span>
              </button>
              <button 
                onClick={openCart}
                className="w-full sm:w-auto group relative flex items-center justify-center gap-2 sm:gap-3 bg-yellow-400 text-gray-900 px-4 sm:px-6 lg:px-8 py-3 lg:py-4 rounded-full font-black text-sm lg:text-lg shadow-2xl transition-all transform hover:scale-110 hover:bg-yellow-300 cursor-pointer"
              >
                <ShoppingCart size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform pointer-events-none" />
                <span className="pointer-events-none">কার্ট দেখুন</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-7 sm:h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-black border-2 border-white animate-pulse pointer-events-none">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* Quick Stats - Enhanced Design with Real-Time Data - Fully Mobile Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 -mt-16 sm:-mt-20 lg:-mt-28 relative z-10">
          <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border-2 border-red-200 hover:border-red-400 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg sm:rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                <Users size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-600 font-bold mb-0.5 sm:mb-1">সক্রিয় গ্রাহক</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">{formatNumber(stats.totalCustomers)}</p>
              </div>
            </div>
          </div>
          <div className="group relative bg-white rounded-2xl p-5 border-2 border-blue-200 hover:border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                <ShoppingCart size={24} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-bold mb-1">সফল অর্ডার</p>
                <p className="text-2xl font-black text-gray-900">{formatNumber(stats.totalOrders)}</p>
              </div>
            </div>
          </div>
          <div className="group relative bg-white rounded-2xl p-5 border-2 border-green-200 hover:border-green-400 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                <Rocket size={24} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-bold mb-1">গড় ডেলিভারি</p>
                <p className="text-2xl font-black text-gray-900">{stats.avgDelivery} মিনিট</p>
              </div>
            </div>
          </div>
          <div className="group relative bg-white rounded-2xl p-5 border-2 border-yellow-200 hover:border-yellow-400 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                <Star size={24} className="text-white fill-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-bold mb-1">গ্রাহক রেটিং</p>
                <p className="text-2xl font-black text-gray-900">{stats.rating}/৫</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter - Modern Design */}
        <div id="products-section" className="mb-8">
          <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 shadow-xl">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={22} />
                <input 
                  type="text" 
                  placeholder="পণ্য খুঁজুন... (নাম, ক্যাটাগরি)" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-500 font-bold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all" 
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-200 hover:bg-red-500 hover:text-white rounded-full transition-all"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)} 
                className="px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none cursor-pointer hover:bg-gray-100 transition-all"
              >
                <option value="popular" className="bg-white font-bold">জনপ্রিয়</option>
                <option value="price-low" className="bg-white font-bold">দাম: কম → বেশি</option>
                <option value="price-high" className="bg-white font-bold">দাম: বেশি → কম</option>
                <option value="newest" className="bg-white font-bold">নতুন</option>
              </select>
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`px-5 py-4 rounded-xl font-black transition-all flex items-center gap-2 shadow-md ${showFilters ? "bg-gradient-to-r from-red-500 to-pink-500 text-white scale-105" : "bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100"}`}
              >
                <SlidersHorizontal size={22} className={showFilters ? "rotate-180" : ""} style={{ transition: 'transform 0.3s' }} />
                ফিল্টার
              </button>
              <button 
                onClick={() => { 
                  setSearchQuery(""); 
                  setSelectedCategory("all"); 
                  setPriceRange([0, 10000]); 
                  setSortBy("popular");
                  setShowFilters(false);
                }}
                className="px-5 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-black transition-all flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
              >
                <RefreshCw size={22} />
                <span className="hidden sm:inline">রিসেট</span>
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-5 pt-5 border-t-2 border-gray-200 animate-in slide-in-from-top duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                    <Tag size={20} className="text-red-500" />
                    মূল্য পরিসীমা
                  </h3>
                  <button 
                    onClick={() => setPriceRange([0, 10000])} 
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-black transition-colors bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100"
                  >
                    <RefreshCw size={14} />
                    রিসেট
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-600 mb-1 block">সর্বনিম্ন</label>
                    <input 
                      type="number" 
                      value={priceRange[0]} 
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} 
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                      placeholder="০"
                    />
                  </div>
                  <div className="text-gray-400 font-black text-2xl mt-5">—</div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-600 mb-1 block">সর্বোচ্চ</label>
                    <input 
                      type="number" 
                      value={priceRange[1]} 
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} 
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                      placeholder="১০০০০"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game Filter - First */}
        {availableGames.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Gamepad2 size={18} className="text-white" />
              </div>
              <h3 className="text-lg font-black text-gray-900">গেম সিলেক্ট করুন</h3>
            </div>
            <div className="flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={() => setSelectedGame("all")} 
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all duration-300 ${
                  selectedGame === "all" 
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 hover:scale-105 hover:shadow-md"
                }`}
              >
                <Gamepad2 size={14} />
                <span>সব গেম</span>
                {selectedGame === "all" && (
                  <CheckCircle size={14} className="animate-in zoom-in duration-200" />
                )}
              </button>
              {availableGames.map((game) => (
                <button 
                  key={game} 
                  onClick={() => setSelectedGame(game)} 
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all duration-300 ${
                    selectedGame === game 
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 hover:scale-105 hover:shadow-md"
                  }`}
                >
                  <span>{game}</span>
                  {selectedGame === game && (
                    <CheckCircle size={14} className="animate-in zoom-in duration-200" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories - Second */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Filter size={18} className="text-white" />
            </div>
            <h3 className="text-lg font-black text-gray-900">ক্যাটাগরি সিলেক্ট করুন</h3>
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button 
                  key={cat.id} 
                  onClick={() => setSelectedCategory(cat.id)} 
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat.id 
                      ? `${cat.color} text-white shadow-lg scale-105` 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 hover:scale-105 hover:shadow-md"
                  }`}
                >
                  <IconComponent size={14} className={`transition-transform duration-300 ${selectedCategory === cat.id ? "" : "group-hover:rotate-12 group-hover:scale-110"}`} />
                  <span>{cat.name}</span>
                  {selectedCategory === cat.id && (
                    <CheckCircle size={14} className="animate-in zoom-in duration-200" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-20 animate-pulse" />
              <Package size={64} className="relative text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">কোন পণ্য পাওয়া যায়নি</h3>
            <p className="text-gray-600 mb-6 font-medium">অন্য ক্যাটাগরি বা সার্চ টার্ম চেষ্টা করুন</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedGame("all"); setPriceRange([0, 10000]); }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-black transition-all shadow-lg hover:shadow-xl"
            >
              <RefreshCw size={18} />
              সব রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              // Horizontal List Card (Same as Best Sellers)
              <div 
                key={product.id} 
                className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-red-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="flex">
                  {/* Image */}
                  <div className="relative w-32 aspect-square flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Badges */}
                    {product.badge && (
                      <div className="absolute top-1 left-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md">
                        {product.badge}
                      </div>
                    )}
                    {product.isFeatured && (
                      <div className="absolute bottom-1 right-1 bg-yellow-400 text-gray-900 px-1.5 py-0.5 rounded-full text-xs font-black flex items-center gap-0.5 shadow-md">
                        <Crown size={10} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-3 flex flex-col">
                    {/* Game Name Badge */}
                    {product.gameName && (
                      <div className="flex items-center gap-1.5 mb-2 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                        <Gamepad2 size={12} className="text-purple-600" />
                        <span className="text-xs text-purple-700 font-bold truncate">{product.gameName}</span>
                      </div>
                    )}

                    <h3 className="text-sm font-black text-gray-900 mb-1 line-clamp-1 group-hover:text-red-500 transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                    </div>

                    {/* Price & Diamonds */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs text-gray-600 font-medium">মূল্য</p>
                        <p className="text-lg font-black text-red-500">৳{product.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 font-medium">ডায়মন্ড</p>
                        <p className="text-sm font-black text-gray-900 flex items-center gap-1">
                          {product.diamonds}
                          <Diamond size={12} className="text-red-500" />
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-1 mt-auto">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} 
                        className="py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-xs"
                      >
                        <Eye size={12} />
                        <span className="hidden sm:inline">দেখুন</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }} 
                        className="py-1.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-xs shadow-md shadow-red-500/30"
                      >
                        <ShoppingCart size={12} />
                        <span className="hidden sm:inline">কার্ট</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate("/checkout", { state: { product } }); }} 
                        className="py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-xs shadow-md shadow-green-500/30"
                      >
                        <Zap size={12} />
                        <span className="hidden sm:inline">কিনুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trending Products Section */}
        {trendingProducts.length > 0 && (
          <div className="mt-12 mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <Flame size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">ট্রেন্ডিং প্রোডাক্ট</h2>
                  <p className="text-sm text-gray-600">সবচেয়ে জনপ্রিয় পণ্যগুলো</p>
                </div>
              </div>
              <TrendingUp size={24} className="text-orange-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="relative w-32 aspect-square flex-shrink-0 bg-gradient-to-br from-orange-50 to-red-50">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                      
                      {/* Rank Badge */}
                      <div className="absolute top-1 left-1 w-7 h-7 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg border-2 border-white">
                        {index + 1}
                      </div>
                      
                      {/* Trending Badge */}
                      <div className="absolute bottom-1 right-1 bg-orange-400 text-white px-1.5 py-0.5 rounded-full text-xs font-black flex items-center gap-0.5 shadow-md">
                        <Flame size={10} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 flex flex-col">
                      {/* Game Name Badge */}
                      {product.gameName && (
                        <div className="flex items-center gap-1.5 mb-2 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                          <Gamepad2 size={12} className="text-purple-600" />
                          <span className="text-xs text-purple-700 font-bold truncate">{product.gameName}</span>
                        </div>
                      )}

                      <h3 className="text-sm font-black text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                      </div>

                      {/* Price & Sales */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs text-gray-600 font-medium">মূল্য</p>
                          <p className="text-lg font-black text-orange-600">৳{product.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600 font-medium">বিক্রয়</p>
                          <p className="text-sm font-black text-gray-900 flex items-center gap-1">
                            <Users size={12} />{product.soldCount}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-1 mt-auto">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} 
                          className="py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-xs"
                        >
                          <Eye size={12} />
                          <span className="hidden sm:inline">দেখুন</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          className="py-1.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-xs shadow-md"
                        >
                          <ShoppingCart size={12} />
                          <span className="hidden sm:inline">কার্ট</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate("/checkout", { state: { product } }); }}
                          className="py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-xs shadow-md"
                        >
                          <Zap size={12} />
                          <span className="hidden sm:inline">কিনুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Sellers Section */}
        {bestSellers.length > 0 && (
          <div className="mt-12 mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <Target size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">বেস্ট সেলার</h2>
                  <p className="text-sm text-gray-600">সবচেয়ে বেশি বিক্রিত পণ্য</p>
                </div>
              </div>
              <Award size={24} className="text-yellow-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bestSellers.map((product, index) => (
                <div 
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="relative w-32 aspect-square flex-shrink-0 bg-gradient-to-br from-yellow-50 to-orange-50">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                      
                      {/* Rank Badge */}
                      <div className="absolute top-1 left-1 w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg border-2 border-white">
                        {index + 1}
                      </div>
                      
                      {/* Best Badge */}
                      <div className="absolute bottom-1 right-1 bg-yellow-400 text-gray-900 px-1.5 py-0.5 rounded-full text-xs font-black flex items-center gap-0.5 shadow-md">
                        <Crown size={10} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 flex flex-col">
                      {/* Game Name Badge */}
                      {product.gameName && (
                        <div className="flex items-center gap-1.5 mb-2 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                          <Gamepad2 size={12} className="text-purple-600" />
                          <span className="text-xs text-purple-700 font-bold truncate">{product.gameName}</span>
                        </div>
                      )}

                      <h3 className="text-sm font-black text-gray-900 mb-1 line-clamp-1 group-hover:text-yellow-600 transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                      </div>

                      {/* Price & Sales */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs text-gray-600 font-medium">মূল্য</p>
                          <p className="text-lg font-black text-yellow-600">৳{product.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600 font-medium">বিক্রয়</p>
                          <p className="text-sm font-black text-gray-900 flex items-center gap-1">
                            <Users size={12} />{product.soldCount}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-1 mt-auto">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} 
                          className="py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-xs"
                        >
                          <Eye size={12} />
                          <span className="hidden sm:inline">দেখুন</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          className="py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-xs shadow-md"
                        >
                          <ShoppingCart size={12} />
                          <span className="hidden sm:inline">কার্ট</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate("/checkout", { state: { product } }); }}
                          className="py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-xs shadow-md"
                        >
                          <Zap size={12} />
                          <span className="hidden sm:inline">কিনুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews Section - Dynamic */}
        <div className="mt-12 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
                <ThumbsUp size={16} />
                <span>গ্রাহক রিভিউ ({reviews.length})</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">আমাদের গ্রাহকরা কি বলছেন</h2>
              <p className="text-gray-600">হাজারো সন্তুষ্ট গ্রাহকের মতামত</p>
            </div>
            
            {/* Write Review Button - Small, Right Side */}
            {user && (
              <button
                onClick={() => setReviewModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold text-sm hover:shadow-lg hover:scale-105 transition-all"
              >
                <MessageCircle size={16} />
                রিভিউ লিখুন
              </button>
            )}
          </div>
          
          {/* Always show reviews from database */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review) => {
              const timeAgo = new Date(review.created_at).toLocaleDateString('bn-BD');
              return (
                <div key={review.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center overflow-hidden">
                      {review.user_avatar ? (
                        <img src={review.user_avatar} alt={review.user_name} className="w-full h-full object-cover" />
                      ) : (
                        <Users size={24} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{review.user_name}</h4>
                        {review.is_verified && (
                          <div title="Verified User">
                            <BadgeCheck size={16} className="text-blue-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                          />
                        ))}
                      </div>
                    </div>
                    <MessageCircle size={20} className="text-purple-500" />
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed line-clamp-3">{review.comment}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />{timeAgo}
                    </span>
                    <button className="flex items-center gap-1 text-purple-500 hover:text-purple-600 font-medium transition-colors">
                      <ThumbsUp size={12} />সহায়ক
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={fetchReviews}
        />

        {/* Special Offers Banner */}
        <div className="mt-12 mb-12">
          <div className="relative bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-3xl p-8 md:p-12 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mt-16 animate-pulse" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mb-20 animate-pulse delay-75" />
              <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -ml-12 -mt-12 animate-pulse delay-150" />
            </div>
            
            <div className="relative z-10 text-center text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-sm mb-4">
                <Gift size={16} />
                <span>বিশেষ অফার</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">প্রথম অর্ডারে ১০% ছাড়!</h2>
              <p className="text-lg mb-6 text-white/90">এখনই রেজিস্টার করুন এবং বিশেষ ডিসকাউন্ট পান</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button 
                  onClick={() => navigate('/register')}
                  className="group flex items-center gap-2 bg-white text-red-500 hover:bg-gray-100 px-6 py-3 rounded-full font-black text-base shadow-xl transition-all transform hover:scale-105"
                >
                  <Rocket size={18} />
                  <span>রেজিস্টার করুন</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold text-base border-2 border-white/30 transition-all"
                >
                  <Percent size={18} />
                  <span>অফার দেখুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
              <CheckCircle size={16} />
              <span>আমাদের সুবিধা</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">কেন আমাদের পছন্দ করবেন?</h2>
            <p className="text-gray-600">আমাদের বিশেষ সুবিধাগুলো</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Shield size={28} className="text-white" />
              </div>
              <h3 className="font-black text-gray-900 mb-2 text-lg">১০০% নিরাপদ</h3>
              <p className="text-sm text-gray-600 leading-relaxed">সুরক্ষিত পেমেন্ট সিস্টেম এবং ডেটা এনক্রিপশন</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-red-500 font-bold">
                <Info size={12} />
                <span>SSL সার্টিফাইড</span>
              </div>
            </div>
            <div className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Truck size={28} className="text-white" />
              </div>
              <h3 className="font-black text-gray-900 mb-2 text-lg">দ্রুত ডেলিভারি</h3>
              <p className="text-sm text-gray-600 leading-relaxed">৫-১৫ মিনিটের মধ্যে তাৎক্ষণিক ডেলিভারি</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-blue-500 font-bold">
                <Rocket size={12} />
                <span>অটো ডেলিভারি</span>
              </div>
            </div>
            <div className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Award size={28} className="text-white" />
              </div>
              <h3 className="font-black text-gray-900 mb-2 text-lg">সেরা দাম</h3>
              <p className="text-sm text-gray-600 leading-relaxed">গ্যারান্টিড সবচেয়ে কম দাম</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-green-500 font-bold">
                <Tag size={12} />
                <span>মূল্য ম্যাচ গ্যারান্টি</span>
              </div>
            </div>
            <div className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Headphones size={28} className="text-white" />
              </div>
              <h3 className="font-black text-gray-900 mb-2 text-lg">২৪/৭ সাপোর্ট</h3>
              <p className="text-sm text-gray-600 leading-relaxed">সবসময় আপনার সেবায় নিয়োজিত</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-orange-500 font-bold">
                <MessageCircle size={12} />
                <span>লাইভ চ্যাট</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">পেমেন্ট মেথড</h2>
            <p className="text-gray-600">আমরা গ্রহণ করি</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl border-2 border-pink-200 shadow-sm">
                <CreditCard size={24} className="text-pink-500" />
                <span className="font-black text-gray-900">bKash</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl border-2 border-orange-200 shadow-sm">
                <CreditCard size={24} className="text-orange-500" />
                <span className="font-black text-gray-900">Nagad</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl border-2 border-purple-200 shadow-sm">
                <CreditCard size={24} className="text-purple-500" />
                <span className="font-black text-gray-900">Rocket</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
              <Info size={16} />
              <span>সাধারণ প্রশ্ন</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
            <p className="text-gray-600">আপনার প্রশ্নের উত্তর এখানে</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: "ডেলিভারি কত সময় লাগে?", a: "সাধারণত ৫-১৫ মিনিটের মধ্যে ডেলিভারি সম্পন্ন হয়।" },
              { q: "পেমেন্ট কিভাবে করবো?", a: "bKash, Nagad, Rocket বা ব্যাংক ট্রান্সফারের মাধ্যমে পেমেন্ট করতে পারবেন।" },
              { q: "রিফান্ড পলিসি কি?", a: "যদি কোন সমস্যা হয় তাহলে ২৪ ঘন্টার মধ্যে রিফান্ড দেওয়া হবে।" },
              { q: "কাস্টমার সাপোর্ট কিভাবে পাবো?", a: "২৪/৭ লাইভ চ্যাট, ইমেইল বা ফোনের মাধ্যমে সাপোর্ট পাবেন।" }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <CartSidebar 
        cart={cart} 
        isOpen={cartOpen} 
        onClose={closeCart} 
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
      </div>
    </Layout>
  );
}
