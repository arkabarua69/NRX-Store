import { useState, useEffect } from "react";
import { 
  Shield, Zap, Heart, Award, Users, Clock, Target, TrendingUp, 
  Sparkles, Crown, Star, CheckCircle, Rocket, Gift, ThumbsUp,
  MessageCircle, Phone, Mail, MapPin, Globe, Flame, Diamond,
  Package, BadgeCheck, Headphones, ArrowRight, Eye, Truck
} from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";

export default function About() {
  const [platformStats, setPlatformStats] = useState({
    active_users: 100000,
    successful_orders: 50000,
    total_orders: 500000,
    avg_delivery_minutes: 8,
    avg_rating: 4.9,
  });

  useEffect(() => {
    fetchPlatformStats();
  }, []);

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
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />

      {/* Hero Section - Ultra Modern */}
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
          <div className="hidden lg:block absolute bottom-32 left-1/4 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }}>
            <Crown size={36} className="text-white/30" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-12 lg:pt-32 pb-16 lg:pb-20">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-black text-xs lg:text-sm mb-4 lg:mb-8 shadow-2xl border-2 border-white/30 animate-pulse">
              <Flame size={16} className="animate-bounce" />
              <span>বাংলাদেশের #১ ডায়মন্ড স্টোর</span>
              <Star size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            
            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-4 lg:mb-6 leading-tight drop-shadow-2xl">
              আমাদের <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100">সম্পর্কে</span>
            </h1>
            
            <p className="text-sm md:text-xl lg:text-2xl text-white/90 mb-6 lg:mb-10 max-w-3xl mx-auto font-bold drop-shadow-lg">
              বাংলাদেশের সবচেয়ে বিশ্বস্ত Free Fire ডায়মন্ড স্টোর
            </p>

            {/* Stats Pills */}
            <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center justify-center gap-2 lg:gap-4">
              <div className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl hover:scale-110 transition-all">
                <div className="p-1 bg-green-500 rounded-full pointer-events-none">
                  <Users size={14} className="text-white pointer-events-none" />
                </div>
                <span className="text-gray-900 font-black text-xs lg:text-sm pointer-events-none">{formatNumber(platformStats.active_users)} গ্রাহক</span>
              </div>
              <div className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl hover:scale-110 transition-all">
                <div className="p-1 bg-blue-500 rounded-full pointer-events-none">
                  <Package size={14} className="text-white pointer-events-none" />
                </div>
                <span className="text-gray-900 font-black text-xs lg:text-sm pointer-events-none">{formatNumber(platformStats.total_orders || platformStats.successful_orders)} অর্ডার</span>
              </div>
              <div className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl hover:scale-110 transition-all">
                <div className="p-1 bg-yellow-500 rounded-full pointer-events-none">
                  <Star size={14} className="text-white fill-white pointer-events-none" />
                </div>
                <span className="text-gray-900 font-black text-xs lg:text-sm pointer-events-none">{platformStats.avg_rating}/৫ রেটিং</span>
              </div>
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

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* About Story Section */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Heart size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900">আমাদের গল্প</h2>
                <p className="text-sm text-gray-600">Our Story</p>
              </div>
            </div>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                <span className="font-black text-red-500">NRX Diamond Store</span> হল বাংলাদেশের সবচেয়ে বিশ্বস্ত এবং দ্রুততম Free Fire ডায়মন্ড টপ-আপ সেবা। 
                আমরা <span className="font-bold text-gray-900">২০২০ সাল</span> থেকে হাজার হাজার গেমারদের সেবা প্রদান করে আসছি।
              </p>

              <p className="text-lg">
                We are Bangladesh's most trusted and fastest Free Fire diamond top-up service. 
                Since 2020, we have been serving thousands of gamers with instant delivery and secure transactions.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 mt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">আমাদের মিশন</h3>
                    <p className="text-gray-700">
                      আমাদের লক্ষ্য হল বাংলাদেশের প্রতিটি Free Fire গেমারকে সহজ, দ্রুত এবং নিরাপদ ডায়মন্ড টপ-আপ সেবা প্রদান করা। 
                      আমরা বিশ্বাস করি যে প্রতিটি গেমার সেরা গেমিং অভিজ্ঞতা পাওয়ার যোগ্য।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us - Enhanced Grid */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
              <CheckCircle size={16} />
              <span>আমাদের সুবিধা</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">কেন আমাদের বেছে নিবেন?</h2>
            <p className="text-gray-600 text-lg">Why Choose NRX Diamond Store</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative bg-white rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Rocket size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">দ্রুত ডেলিভারি</h3>
                <p className="text-gray-600 leading-relaxed mb-4">৫-১৫ মিনিটের মধ্যে তাৎক্ষণিক ডায়মন্ড ডেলিভারি</p>
                <div className="flex items-center gap-2 text-sm text-blue-600 font-bold">
                  <Zap size={16} />
                  <span>অটো ডেলিভারি সিস্টেম</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Shield size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">নিরাপদ লেনদেন</h3>
                <p className="text-gray-600 leading-relaxed mb-4">১০০% সুরক্ষিত পেমেন্ট এবং ডেটা এনক্রিপশন</p>
                <div className="flex items-center gap-2 text-sm text-green-600 font-bold">
                  <BadgeCheck size={16} />
                  <span>SSL সার্টিফাইড</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Award size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">সেরা মূল্য</h3>
                <p className="text-gray-600 leading-relaxed mb-4">বাজারের সবচেয়ে কম দামে প্রিমিয়াম ডায়মন্ড</p>
                <div className="flex items-center gap-2 text-sm text-purple-600 font-bold">
                  <Gift size={16} />
                  <span>মূল্য ম্যাচ গ্যারান্টি</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 border-2 border-orange-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Headphones size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">২৪/৭ সাপোর্ট</h3>
                <p className="text-gray-600 leading-relaxed mb-4">যেকোনো সময় সাহায্যের জন্য সবসময় প্রস্তুত</p>
                <div className="flex items-center gap-2 text-sm text-orange-600 font-bold">
                  <MessageCircle size={16} />
                  <span>লাইভ চ্যাট সাপোর্ট</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Star size={32} className="text-white fill-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">উচ্চ রেটিং</h3>
                <p className="text-gray-600 leading-relaxed mb-4">হাজারো সন্তুষ্ট গ্রাহকের বিশ্বাস</p>
                <div className="flex items-center gap-2 text-sm text-yellow-600 font-bold">
                  <ThumbsUp size={16} />
                  <span>{platformStats.avg_rating}/৫ গ্রাহক রেটিং</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 border-2 border-red-200 hover:border-red-400 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500 to-pink-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Eye size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">স্বচ্ছতা</h3>
                <p className="text-gray-600 leading-relaxed mb-4">সম্পূর্ণ স্বচ্ছ এবং সৎ ব্যবসায়িক নীতি</p>
                <div className="flex items-center gap-2 text-sm text-red-600 font-bold">
                  <CheckCircle size={16} />
                  <span>কোন লুকানো চার্জ নেই</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48" />
            </div>

            <div className="relative">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-sm mb-4">
                  <TrendingUp size={16} />
                  <span>আমাদের অর্জন</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-2">আমরা গর্বিত</h2>
                <p className="text-white/80">Our Achievements</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users size={32} className="text-white" />
                  </div>
                  <p className="text-4xl font-black mb-2">{formatNumber(platformStats.active_users)}</p>
                  <p className="text-white/80 text-sm font-semibold">খুশি গ্রাহক</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-white" />
                  </div>
                  <p className="text-4xl font-black mb-2">{formatNumber(platformStats.successful_orders)}</p>
                  <p className="text-white/80 text-sm font-semibold">সফল অর্ডার</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock size={32} className="text-white" />
                  </div>
                  <p className="text-4xl font-black mb-2">{platformStats.avg_delivery_minutes} মিনিট</p>
                  <p className="text-white/80 text-sm font-semibold">গড় ডেলিভারি</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star size={32} className="text-white fill-white" />
                  </div>
                  <p className="text-4xl font-black mb-2">{platformStats.avg_rating}/৫</p>
                  <p className="text-white/80 text-sm font-semibold">গ্রাহক রেটিং</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
              <Phone size={16} />
              <span>যোগাযোগ করুন</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">আমাদের সাথে যোগাযোগ</h2>
            <p className="text-gray-600 text-lg">Get In Touch With Us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="https://wa.me/8801883800356"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all">
                <Phone size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">ফোন / WhatsApp</h3>
              <p className="text-gray-600 mb-4">+880 1883-800356</p>
              <div className="inline-flex items-center gap-2 text-green-600 font-bold text-sm">
                <span>কল করুন</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            <a 
              href="mailto:support@nrxstore.com"
              className="group bg-white rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all">
                <Mail size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">ইমেইল</h3>
              <p className="text-gray-600 mb-4">support@nrxstore.com</p>
              <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm">
                <span>ইমেইল পাঠান</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            <div className="group bg-white rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all">
                <MapPin size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">লোকেশন</h3>
              <p className="text-gray-600 mb-4">Dhaka, Bangladesh</p>
              <div className="inline-flex items-center gap-2 text-purple-600 font-bold text-sm">
                <Globe size={16} />
                <span>অনলাইন সেবা</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mt-16 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mb-20 animate-pulse delay-75" />
          </div>
          
          <div className="relative z-10 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-black mb-4">এখনই শুরু করুন!</h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              আজই আমাদের সাথে যুক্ত হন এবং সেরা ডায়মন্ড টপ-আপ অভিজ্ঞতা উপভোগ করুন
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/store"
                className="group flex items-center gap-2 bg-white text-red-500 hover:bg-gray-100 px-8 py-4 rounded-full font-black text-lg shadow-xl transition-all transform hover:scale-105"
              >
                <Diamond size={20} />
                <span>ডায়মন্ড কিনুন</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://wa.me/8801883800356"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-white/30 transition-all"
              >
                <Phone size={20} />
                <span>সাপোর্ট</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
