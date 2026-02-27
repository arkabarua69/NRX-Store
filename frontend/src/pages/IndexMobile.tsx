import { useState, useEffect } from "react";
import { 
  Sparkles, Crown, Shield, Award, Star, 
  Users, BadgeCheck, Rocket, Diamond,
  CheckCircle, Package, Flame, ShoppingCart, MessageCircle, Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "@/components/mobile-v2/MobileLayout";
import { StatsCard, FeatureCard } from "@/components/mobile-v2";
import { getAllReviews, Review } from "@/lib/reviewService";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationCount } from "@/hooks/useNotificationCount";
import ReviewSubmitModal from "@/components/ReviewSubmitModal";
import { useCart } from "@/contexts/CartContext";

export default function IndexMobile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const { unreadCount: notificationCount } = useNotificationCount();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { cart } = useCart();
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
    const data = await getAllReviews();
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
    <MobileLayout
      showAppBar={true}
      showNavBar={true}
      appBarProps={{
        showLogo: true,
        showCart: true,
        showNotification: true,
        cartCount: cart?.length || 0,
        notificationCount: notificationCount,
      }}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 px-4 pt-8 pb-12">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mt-32"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mb-40"
          />
        </div>

        <div className="relative z-10">
          {/* Special Offer Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-black text-xs mb-6 border border-white/30"
          >
            <Flame size={14} className="animate-bounce" />
            <span>বাংলাদেশের #১ গেম টপ আপ শপ</span>
            <Sparkles size={14} />
          </motion.div>

          {/* Title - SEO Optimized */}
          <h1 className="text-4xl font-black text-white mb-3 leading-tight">
            Nrx Store - <span className="text-yellow-300">গেম টপ আপ শপ</span>
          </h1>
          <p className="text-white/90 text-base mb-6 font-bold flex items-center gap-2">
            <Rocket size={18} />
            Free Fire, PUBG, ML ডায়মন্ড - ৮ মিনিটে ডেলিভারি
          </p>

          {/* Feature Pills */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { icon: BadgeCheck, text: '১০০% নিরাপদ', color: 'from-green-500 to-emerald-500' },
              { icon: Rocket, text: `${platformStats.avg_delivery_minutes} মিনিট ডেলিভারি`, color: 'from-blue-500 to-cyan-500' },
              { icon: Users, text: `${formatNumber(platformStats.active_users)} গ্রাহক`, color: 'from-purple-500 to-pink-500' },
              { icon: Star, text: `${platformStats.avg_rating}/৫ রেটিং`, color: 'from-yellow-500 to-orange-500' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2.5 rounded-xl border-2 border-white shadow-lg`}
              >
                <div className={`p-1.5 bg-gradient-to-r ${item.color} rounded-lg`}>
                  <item.icon size={14} className="text-white" />
                </div>
                <span className="text-gray-900 font-black text-xs">{item.text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/store')}
              className="flex items-center justify-center gap-2 bg-white text-red-500 px-6 py-4 rounded-2xl font-black text-base shadow-2xl"
            >
              <ShoppingCart size={22} />
              <span>ডায়মন্ড কিনুন</span>
              <Sparkles size={22} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/about')}
              className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-2xl font-black text-base border-2 border-white/50"
            >
              <Package size={22} />
              <span>আরও জানুন</span>
            </motion.button>
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
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-8 mb-6 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <StatsCard
            icon={Users}
            label="সক্রিয় গ্রাহক"
            value={formatNumber(platformStats.active_users)}
            gradient="from-red-500 to-pink-500"
            delay={0}
          />
          <StatsCard
            icon={ShoppingCart}
            label="সফল অর্ডার"
            value={formatNumber(platformStats.successful_orders)}
            gradient="from-blue-500 to-cyan-500"
            delay={0.1}
          />
          <StatsCard
            icon={Rocket}
            label="গড় ডেলিভারি"
            value={`${platformStats.avg_delivery_minutes} মিনিট`}
            gradient="from-green-500 to-emerald-500"
            delay={0.2}
          />
          <StatsCard
            icon={Star}
            label="গ্রাহক রেটিং"
            value={`${platformStats.avg_rating}/৫`}
            gradient="from-yellow-500 to-orange-500"
            delay={0.3}
          />
        </div>
      </div>

      {/* Packages Section */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">গেম টপ আপ প্যাকেজ</h2>
            <p className="text-sm text-gray-600 font-medium">Free Fire, PUBG, ML - সকল গেমের ডায়মন্ড</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FeatureCard
            icon={Sparkles}
            title="বাজেট প্যাক"
            subtitle="Budget"
            description="সাশ্রয়ী মূল্যে"
            gradient="from-blue-500 to-cyan-500"
            path="/store?category=budget"
            delay={0}
          />
          <FeatureCard
            icon={Star}
            title="স্ট্যান্ডার্ড"
            subtitle="জনপ্রিয়"
            description="সবচেয়ে বেশি বিক্রিত"
            gradient="from-yellow-500 to-orange-500"
            badge="Hot"
            badgeGradient="from-orange-500 to-red-500"
            path="/store?category=standard"
            delay={0.1}
          />
          <FeatureCard
            icon={Flame}
            title="প্রিমিয়াম প্যাক"
            subtitle="Premium"
            description="বেশি সাশ্রয়"
            gradient="from-red-500 to-pink-500"
            path="/store?category=premium"
            delay={0.2}
          />
          <FeatureCard
            icon={Crown}
            title="VIP"
            subtitle="মেম্বারশিপ"
            description="প্রিমিয়াম সুবিধা"
            gradient="from-purple-500 to-pink-500"
            badge="VIP"
            badgeGradient="from-purple-600 to-pink-600"
            path="/store?category=membership"
            delay={0.3}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-8 px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-xs mb-3">
            <CheckCircle size={14} />
            <span>আমাদের সুবিধা সমূহ</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            কেন Nrx Store বেছে নিবেন?
          </h2>
          <p className="text-sm text-gray-600">বাংলাদেশের সবচেয়ে বিশ্বস্ত গেম টপ আপ সেবা</p>
        </div>

        <div className="space-y-4">
          {[
            {
              icon: Rocket,
              title: 'তাৎক্ষণিক ডেলিভারি',
              description: 'গড়ে মাত্র ৮ মিনিটে ডায়মন্ড/UC পৌঁছে যাবে',
              gradient: 'from-blue-500 to-cyan-500',
            },
            {
              icon: Award,
              title: 'সর্বনিম্ন দাম',
              description: 'বাজারের সবচেয়ে কম দামে সেরা সেবা',
              gradient: 'from-yellow-500 to-orange-500',
            },
            {
              icon: Shield,
              title: '১০০% নিরাপদ',
              description: 'সম্পূর্ণ সুরক্ষিত এবং বিশ্বস্ত লেনদেন',
              gradient: 'from-green-500 to-emerald-500',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100"
            >
              <div className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg flex-shrink-0`}>
                <feature.icon size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="px-4 py-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-xs mb-3">
            <MessageCircle size={14} />
            <span>গ্রাহক রিভিউ</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            আমাদের গ্রাহকরা কি বলছেন
          </h2>
          
          {/* Add Review Button */}
          {user && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-black text-sm shadow-lg hover:shadow-xl transition-all mt-3"
            >
              <Plus size={18} />
              <span>রিভিউ লিখুন</span>
            </motion.button>
          )}
        </div>

        <div className="space-y-3">
          {(reviews.length > 0 ? reviews.slice(0, 3) : [
            { id: '1', user_name: "রাফি আহমেদ", rating: 5, comment: "অসাধারণ সেবা! মাত্র ৫ মিনিটে ডায়মন্ড পেয়ে গেছি।", created_at: new Date().toISOString(), is_verified: true, user_avatar: undefined },
            { id: '2', user_name: "সাকিব হাসান", rating: 5, comment: "খুবই ভালো অভিজ্ঞতা। সাপোর্ট টিম অনেক সহায়ক।", created_at: new Date().toISOString(), is_verified: true, user_avatar: undefined },
            { id: '3', user_name: "তানভীর ইসলাম", rating: 5, comment: "বিশ্বস্ত এবং দ্রুত সেবা। সবাইকে রেকমেন্ড করবো।", created_at: new Date().toISOString(), is_verified: true, user_avatar: undefined },
          ]).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar with proper image support */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-gray-100">
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
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-black text-sm">
                      {review.user_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{review.user_name}</h4>
                    {review.is_verified && <BadgeCheck size={14} className="text-blue-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-3xl p-8 text-center shadow-2xl"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mt-16 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mb-20 animate-pulse" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-xs mb-4 text-white">
              <Sparkles size={14} />
              <span>বিশেষ অফার</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">
              প্রস্তুত আপনার এডভেঞ্চার শুরু করতে?
            </h2>
            <p className="text-white/90 text-sm mb-6">
              আজই যোগ দিন এবং এক্সক্লুসিভ অফার পান
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/store")}
              className="flex items-center justify-center gap-2 bg-white text-red-500 px-8 py-4 rounded-2xl font-black text-base shadow-2xl mx-auto"
            >
              <Diamond size={22} />
              <span>এখনই শুরু করুন</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Review Submit Modal */}
      <ReviewSubmitModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSuccess={() => {
          fetchReviews(); // Refresh reviews after submission
        }}
      />
    </MobileLayout>
  );
}
