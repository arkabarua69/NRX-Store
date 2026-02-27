import { useState, useEffect } from "react";
import { 
  Sparkles, Zap, Crown, Gift, Shield, Award, Star, 
  Users, Clock, BadgeCheck, TrendingUp, Rocket, Diamond,
  CheckCircle, ArrowRight, Package, Target, Flame, ShoppingCart,
  MessageCircle, ThumbsUp, Info, Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Footer from "@/components/ui/Footer";
import { getAllReviews, Review } from "@/lib/reviewService";
import ReviewSubmitModal from "@/components/ReviewSubmitModal";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [platformStats, setPlatformStats] = useState({
    active_users: 100000,
    successful_orders: 50000,
    avg_delivery_minutes: 8,
    avg_rating: 4.9,
  });

  useEffect(() => {
    fetchReviews();
    fetchPlatformStats();
  }, []);

  const fetchReviews = async () => {
    console.log("📥 Fetching reviews...");
    const data = await getAllReviews();
    console.log("✅ Reviews fetched:", data.length);
    setReviews(data);
  };

  const fetchPlatformStats = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_BASE}/stats/platform-stats`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPlatformStats(result.data);
          console.log("✅ Platform stats fetched:", result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching platform stats:", error);
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Ultra Modern with Animations */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-pink-500 to-purple-600">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-64 lg:w-96 h-64 lg:h-96 bg-white/10 rounded-full blur-3xl -ml-32 lg:-ml-48 -mt-32 lg:-mt-48 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-80 lg:w-[500px] h-80 lg:h-[500px] bg-white/10 rounded-full blur-3xl -mr-40 lg:-mr-64 -mb-40 lg:-mb-64 animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Floating Icons */}
            <div className="hidden lg:block absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
              <Diamond size={32} className="text-white/30" />
            </div>
            <div className="hidden lg:block absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
              <Sparkles size={28} className="text-yellow-300/40" />
            </div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 pt-12 lg:pt-32 pb-16 lg:pb-20">
            <div className="text-center mb-6 lg:mb-8">
              {/* Animated Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-black text-xs lg:text-sm mb-4 lg:mb-8 shadow-2xl border-2 border-white/30 animate-pulse">
                <Flame size={16} className="animate-bounce" />
                <span>বাংলাদেশের #১ গেম টপ আপ শপ</span>
                <Sparkles size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              
              {/* Main Title with Gradient - SEO Optimized */}
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-4 lg:mb-6 leading-tight drop-shadow-2xl">
                Nrx Store - <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 animate-pulse">গেম টপ আপ শপ</span>
              </h1>
              
              <p className="text-sm md:text-xl lg:text-2xl text-white/90 mb-6 lg:mb-10 max-w-3xl mx-auto font-bold drop-shadow-lg">
                <Rocket size={20} className="inline-block mr-2" /> 
                Free Fire, PUBG, Mobile Legends ডায়মন্ড ও UC - ৮ মিনিটে তাৎক্ষণিক ডেলিভারি
              </p>
              
              {/* Feature Pills - Responsive Grid */}
              <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center justify-center gap-2 lg:gap-4 mb-6 lg:mb-10">
                <div className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl transition-all hover:scale-110 cursor-pointer">
                  <div className="p-1 bg-green-500 rounded-full pointer-events-none">
                    <BadgeCheck size={14} className="text-white pointer-events-none" />
                  </div>
                  <span className="text-gray-900 font-black text-xs lg:text-sm pointer-events-none">১০০% নিরাপদ</span>
                </div>
                <div className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl transition-all hover:scale-110 cursor-pointer">
                  <div className="p-1 bg-blue-500 rounded-full pointer-events-none">
                    <Rocket size={14} className="text-white pointer-events-none" />
                  </div>
                  <span className="text-gray-900 font-black text-xs lg:text-sm pointer-events-none">{platformStats.avg_delivery_minutes} মিনিট ডেলিভারি</span>
                </div>
                <div className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl transition-all hover:scale-110 cursor-pointer">
                  <div className="p-1 bg-purple-500 rounded-full pointer-events-none">
                    <Users size={14} className="text-white pointer-events-none" />
                  </div>
                  <span className="text-gray-900 font-black text-xs lg:text-sm pointer-events-none">{formatNumber(platformStats.active_users)} গ্রাহক</span>
                </div>
                <div className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl transition-all hover:scale-110 cursor-pointer">
                  <div className="p-1 bg-yellow-500 rounded-full pointer-events-none">
                    <Star size={14} className="text-white fill-white pointer-events-none" />
                  </div>
                  <span className="text-gray-900 font-black text-xs lg:text-sm pointer-events-none">{platformStats.avg_rating}/৫ রেটিং</span>
                </div>
              </div>

              {/* CTA Buttons - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4">
                <button 
                  onClick={() => navigate('/store')}
                  className="w-full sm:w-auto group flex items-center justify-center gap-2 lg:gap-3 bg-white text-red-500 px-6 lg:px-8 py-3 lg:py-4 rounded-full font-black text-sm lg:text-lg shadow-2xl transition-all transform hover:scale-110 hover:-translate-y-1 hover:shadow-3xl cursor-pointer"
                >
                  <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform pointer-events-none" />
                  <span className="pointer-events-none">ডায়মন্ড কিনুন</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform pointer-events-none" />
                </button>
                <button 
                  onClick={() => navigate('/about')}
                  className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white px-6 lg:px-8 py-3 lg:py-4 rounded-full font-black text-sm lg:text-lg border-2 border-white/50 transition-all transform hover:scale-110 hover:bg-white/20 cursor-pointer"
                >
                  <Info size={22} className="group-hover:rotate-12 transition-transform pointer-events-none" />
                  <span className="pointer-events-none">আরও জানুন</span>
                </button>
              </div>
            </div>
          </div>

          {/* SEO Content Section - Hidden but crawlable */}
          <div className="sr-only">
            <h2>Nrx Store - বাংলাদেশের সবচেয়ে বিশ্বস্ত গেম টপ আপ সেবা</h2>
            <p>
              Nrx Store বাংলাদেশের সবচেয়ে বিশ্বস্ত এবং দ্রুততম গেম টপ আপ সেবা প্রদানকারী। 
              আমরা Free Fire ডায়মন্ড, PUBG Mobile UC, Mobile Legends ডায়মন্ড, COD Mobile CP 
              এবং আরও অনেক জনপ্রিয় গেমের টপ আপ সেবা প্রদান করি। আমাদের সেবা সম্পূর্ণ নিরাপদ, 
              দ্রুত এবং সাশ্রয়ী। গড়ে মাত্র ৮ মিনিটে আপনার অ্যাকাউন্টে ডায়মন্ড বা UC পৌঁছে যাবে।
            </p>
            <h3>কেন Nrx Store বেছে নিবেন?</h3>
            <ul>
              <li>তাৎক্ষণিক ডেলিভারি - গড়ে ৮ মিনিট</li>
              <li>১০০% নিরাপদ এবং বিশ্বস্ত</li>
              <li>সর্বনিম্ন দাম গ্যারান্টি</li>
              <li>bKash, Nagad, Rocket পেমেন্ট সাপোর্ট</li>
              <li>২৪/৭ কাস্টমার সাপোর্ট</li>
              <li>১,০০,০০০+ সন্তুষ্ট গ্রাহক</li>
              <li>৫০,০০০+ সফল অর্ডার</li>
              <li>৪.৯/৫ গ্রাহক রেটিং</li>
            </ul>
            <h3>আমাদের সেবা সমূহ</h3>
            <p>
              Free Fire Diamond Top Up, PUBG Mobile UC Top Up, Mobile Legends Diamond, 
              Call of Duty Mobile CP, Genshin Impact Genesis Crystals, এবং আরও অনেক 
              জনপ্রিয় গেমের টপ আপ সেবা। সকল প্যাকেজ বাজেট, স্ট্যান্ডার্ড, প্রিমিয়াম এবং 
              মেম্বারশিপ ক্যাটাগরিতে উপলব্ধ।
            </p>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
            </svg>
          </div>
        </div>


        {/* Quick Stats - Enhanced Design */}
        <div className="max-w-7xl mx-auto px-4 -mt-12 mb-16 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group relative bg-white rounded-2xl p-5 border-2 border-red-200 hover:border-red-400 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-bold mb-1">সক্রিয় গ্রাহক</p>
                  <p className="text-2xl font-black text-gray-900">{formatNumber(platformStats.active_users)}</p>
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
                  <p className="text-2xl font-black text-gray-900">{formatNumber(platformStats.successful_orders)}</p>
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
                  <p className="text-2xl font-black text-gray-900">{platformStats.avg_delivery_minutes} মিনিট</p>
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
                  <p className="text-2xl font-black text-gray-900">{platformStats.avg_rating}/৫</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Packages Section - Modern Cards */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
              <Gift size={16} />
              <span>আমাদের প্যাকেজ সমূহ</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-gray-900">
              গেম টপ আপ প্যাকেজ
            </h2>
            <p className="text-gray-600 text-lg mb-2 font-medium">
              Free Fire, PUBG, Mobile Legends - সকল গেমের ডায়মন্ড ও UC
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Budget Pack */}
            <button
              onClick={() => navigate("/store?category=budget")}
              className="group relative overflow-hidden rounded-2xl p-8 bg-white border-2 border-blue-200 hover:border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-gray-900 mb-1">বাজেট প্যাক</h3>
                  <p className="text-sm font-bold text-blue-600">Budget Packs</p>
                  <p className="text-xs text-gray-600 mt-2 font-medium">সাশ্রয়ী মূল্যে ডায়মন্ড</p>
                </div>
                <div className="mt-2 flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm group-hover:from-blue-600 group-hover:to-cyan-600 transition-all shadow-md">
                  <span>দেখুন</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>


            {/* Popular Pack */}
            <button
              onClick={() => navigate("/store?category=standard")}
              className="group relative overflow-hidden rounded-2xl p-8 bg-white border-2 border-yellow-200 hover:border-yellow-400 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
            >
              <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                <TrendingUp size={12} />Hot
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Star className="w-10 h-10 text-white fill-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-gray-900 mb-1">স্ট্যান্ডার্ড প্যাক</h3>
                  <p className="text-sm font-bold text-yellow-600">জনপ্রিয়</p>
                  <p className="text-xs text-gray-600 mt-2 font-medium">সবচেয়ে বেশি বিক্রিত</p>
                </div>
                <div className="mt-2 flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm group-hover:from-yellow-600 group-hover:to-orange-600 transition-all shadow-md">
                  <span>দেখুন</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Big Pack */}
            <button
              onClick={() => navigate("/store?category=premium")}
              className="group relative overflow-hidden rounded-2xl p-8 bg-white border-2 border-red-200 hover:border-red-400 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Flame className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-gray-900 mb-1">প্রিমিয়াম প্যাক</h3>
                  <p className="text-sm font-bold text-red-600">Premium Packs</p>
                  <p className="text-xs text-gray-600 mt-2 font-medium">বেশি ডায়মন্ড, বেশি সাশ্রয়</p>
                </div>
                <div className="mt-2 flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-sm group-hover:from-red-600 group-hover:to-pink-600 transition-all shadow-md">
                  <span>দেখুন</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Membership */}
            <button
              onClick={() => navigate("/store?category=membership")}
              className="group relative overflow-hidden rounded-2xl p-8 bg-white border-2 border-purple-200 hover:border-purple-400 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
            >
              <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                <Crown size={12} />VIP
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-gray-900 mb-1">Membership</h3>
                  <p className="text-sm font-bold text-purple-600">মেম্বারশিপ</p>
                  <p className="text-xs text-gray-600 mt-2 font-medium">প্রিমিয়াম সুবিধা পান</p>
                </div>
                <div className="mt-2 flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm group-hover:from-purple-600 group-hover:to-pink-600 transition-all shadow-md">
                  <span>দেখুন</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>
        </div>


        {/* Features Section - Enhanced */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
                <CheckCircle size={16} />
                <span>আমাদের সুবিধা সমূহ</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-gray-900">
                কেন Nrx Store বেছে নিবেন?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                বাংলাদেশের সবচেয়ে বিশ্বস্ত গেম টপ আপ সেবা - ১০০% নিরাপদ ও দ্রুত
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-gray-50 rounded-2xl p-8 text-center border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Rocket size={36} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  তাৎক্ষণিক ডেলিভারি
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  গড়ে মাত্র ৮ মিনিটে আপনার অ্যাকাউন্টে ডায়মন্ড/UC পৌঁছে যাবে
                </p>
                <div className="mt-4 flex items-center justify-center gap-1 text-xs text-blue-500 font-bold">
                  <Zap size={12} />
                  <span>অটোমেটিক ডেলিভারি সিস্টেম</span>
                </div>
              </div>

              <div className="group bg-gray-50 rounded-2xl p-8 text-center border-2 border-gray-200 hover:border-yellow-300 hover:shadow-2xl transition-all duration-300">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Award size={36} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  সর্বনিম্ন দাম
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  বাজারের সবচেয়ে কম দামে সেরা মানের সেবা পান
                </p>
                <div className="mt-4 flex items-center justify-center gap-1 text-xs text-yellow-600 font-bold">
                  <Target size={12} />
                  <span>মূল্য ম্যাচ গ্যারান্টি</span>
                </div>
              </div>

              <div className="group bg-gray-50 rounded-2xl p-8 text-center border-2 border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Shield size={36} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  নিরাপদ লেনদেন
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  আপনার তথ্য সুরক্ষিত এবং এনক্রিপ্ট করা হয়
                </p>
                <div className="mt-4 flex items-center justify-center gap-1 text-xs text-green-600 font-bold">
                  <BadgeCheck size={12} />
                  <span>SSL সার্টিফাইড</span>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all">
                <Users size={32} className="text-red-500 mx-auto mb-3" />
                <p className="text-sm font-black text-gray-900">{formatNumber(platformStats.active_users)} গ্রাহক</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <Clock size={32} className="text-blue-500 mx-auto mb-3" />
                <p className="text-sm font-black text-gray-900">২৪/৭ সাপোর্ট</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
                <Star size={32} className="text-yellow-500 fill-yellow-500 mx-auto mb-3" />
                <p className="text-sm font-black text-gray-900">{platformStats.avg_rating}/৫ রেটিং</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
                <TrendingUp size={32} className="text-green-500 mx-auto mb-3" />
                <p className="text-sm font-black text-gray-900">দ্রুত বৃদ্ধি</p>
              </div>
            </div>
          </div>
        </div>


        {/* Testimonials Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
              <ThumbsUp size={16} />
              <span>গ্রাহক রিভিউ</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-gray-900">
              আমাদের গ্রাহকরা কি বলছেন
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              হাজারো সন্তুষ্ট গ্রাহকের মতামত
            </p>
            
            {/* Add Review Button */}
            {user && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-black text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Plus size={18} />
                <span>রিভিউ লিখুন</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.length > 0 ? (
              reviews.slice(0, 3).map((review) => {
                console.log("Review data:", review);
                console.log("User avatar:", review.user_avatar);
                const timeAgo = new Date(review.created_at).toLocaleDateString('bn-BD');
                return (
                  <div key={review.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      {/* Avatar with proper image support */}
                      <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-gray-100">
                        {review.user_avatar ? (
                          <img 
                            src={review.user_avatar} 
                            alt={review.user_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to generated avatar if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name)}&background=9333ea&color=fff&bold=true&size=128`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-black text-lg">
                            {review.user_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">{review.user_name}</h4>
                          {review.is_verified && (
                            <BadgeCheck size={16} className="text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                      <MessageCircle size={20} className="text-purple-500" />
                    </div>
                    <p className="text-gray-700 leading-relaxed line-clamp-3">{review.comment}</p>
                    <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />{timeAgo}
                      </span>
                      <button className="flex items-center gap-1 text-purple-500 hover:text-purple-600 font-medium transition-colors">
                        <ThumbsUp size={12} />সহায়ক
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback to static reviews if no database reviews
              [
                { name: "রাফি আহমেদ", rating: 5, comment: "অসাধারণ সেবা! মাত্র ৫ মিনিটে ডায়মন্ড পেয়ে গেছি। দাম ও অনেক কম।", avatar: "👤" },
                { name: "সাকিব হাসান", rating: 5, comment: "খুবই ভালো অভিজ্ঞতা। সাপোর্ট টিম অনেক সহায়ক। আবারও কিনবো।", avatar: "👤" },
                { name: "তানভীর ইসলাম", rating: 5, comment: "বিশ্বস্ত এবং দ্রুত সেবা। সবাইকে রেকমেন্ড করবো।", avatar: "👤" }
              ].map((review, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <BadgeCheck size={16} className="text-blue-500" />
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <MessageCircle size={20} className="text-purple-500" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />২ দিন আগে
                    </span>
                    <button className="flex items-center gap-1 text-purple-500 hover:text-purple-600 font-medium transition-colors">
                      <ThumbsUp size={12} />সহায়ক
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>


        {/* CTA Section - Modern */}
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="relative overflow-hidden bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mt-16 animate-pulse" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mb-20 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-sm mb-6 text-white">
                <Sparkles size={16} />
                <span>বিশেষ অফার</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                প্রস্তুত আপনার এডভেঞ্চার শুরু করতে?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                আজই যোগ দিন এবং এক্সক্লুসিভ অফার পান - Join Today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/store")}
                  className="group flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-red-500 px-8 py-4 rounded-full font-black text-lg shadow-2xl transition-all transform hover:scale-110"
                >
                  <Diamond size={22} className="group-hover:rotate-12 transition-transform" />
                  <span>এখনই শুরু করুন</span>
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
                <Info size={16} />
                <span>কিভাবে কাজ করে</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-gray-900">
                মাত্র ৩টি ধাপে ডায়মন্ড কিনুন
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                    1
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <ShoppingCart size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 text-center">প্যাকেজ সিলেক্ট করুন</h3>
                  <p className="text-gray-600 text-center">আপনার পছন্দের ডায়মন্ড প্যাকেজ বেছে নিন</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                    2
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Package size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 text-center">পেমেন্ট করুন</h3>
                  <p className="text-gray-600 text-center">bKash, Nagad বা Rocket দিয়ে পেমেন্ট করুন</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                    3
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Rocket size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 text-center">ডায়মন্ড পান</h3>
                  <p className="text-gray-600 text-center">৫-১৫ মিনিটে আপনার একাউন্টে ডায়মন্ড</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Review Submit Modal */}
      <ReviewSubmitModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSuccess={fetchReviews}
      />
    </Layout>
  );
}
