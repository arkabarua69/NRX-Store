import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Heart, Star, ArrowLeft, Share2,
  Package, Shield, Zap, Crown, CheckCircle,
  MessageCircle, ThumbsUp, Eye, ChevronDown, ChevronUp,
  Info, AlertCircle, RefreshCw, Percent, Send, X, Check, Users, BadgeCheck, Clock
} from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getProductById } from "@/lib/productService";
import { getAllReviews, submitReview, Review } from "@/lib/reviewService";
import ReviewModal from "@/components/ReviewModal";
import CartSidebar from "@/components/CartSidebar";
import { toast } from "@/hooks/use-toast";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { cart, cartOpen, addToCart: addToCartContext, updateQuantity, removeFromCart, closeCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"details" | "reviews" | "faq">("details");

  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [productReviews, setProductReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!id) {
      navigate("/store");
      return;
    }
    loadProduct();
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    const data = await getAllReviews();
    setReviews(data);
    // Filter reviews for this product if needed, or show all reviews
    setProductReviews(data);
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProductById(id!);

      if (!productData) {
        toast({
          title: "পণ্য খুঁজে পাওয়া যায়নি!",
          variant: "destructive",
        });
        navigate("/store");
        return;
      }

      setProduct(productData);
    } catch (error) {
      console.error("Error loading product:", error);
      toast({
        title: "পণ্য লোড করতে সমস্যা হয়েছে!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product) return;
    addToCartContext(product, quantity);
  };

  const buyNow = () => {
    if (!product) return;
    navigate("/checkout", { state: { product, quantity } });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "উইশলিস্ট থেকে সরানো হয়েছে!" : "উইশলিস্টে যোগ করা হয়েছে!",
      description: product?.name,
    });
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || "NRX Store Product",
        text: product?.description || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "লিংক কপি করা হয়েছে!",
        description: "আপনি এখন এই পণ্যটি শেয়ার করতে পারবেন",
      });
    }
  };

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



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar />
        <LoadingSpinner
          message="পণ্যের বিস্তারিত লোড হচ্ছে..."
          submessage="অনুগ্রহ করে অপেক্ষা করুন"
          fullScreen={false}
          size="md"
        />
      </div>
    );
  }

  if (!product) return null;

  const discount = product.category === "premium" ? 15 : product.category === "standard" ? 10 : 5;
  const originalPrice = Math.round(product.price / (1 - discount / 100));

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Breadcrumb - Modern Style */}
        <div className="flex items-center gap-2 text-sm py-4 mb-6">
          <button onClick={() => navigate("/")} className="text-gray-600 hover:text-[#FF3B30] font-bold transition-colors">
            হোম / Home
          </button>
          <span className="text-gray-400">›</span>
          <button onClick={() => navigate("/store")} className="text-gray-600 hover:text-[#FF3B30] font-bold transition-colors">
            স্টোর / Store
          </button>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900 font-bold">{product.name}</span>
        </div>

        {/* Main Content - New Modern Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Left: Image Gallery - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image with Gradient Background */}
            <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-200 group">
              <div className="aspect-video lg:aspect-square bg-white/50 backdrop-blur-sm p-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Floating Badges */}
              {product.badge && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white px-5 py-2.5 text-sm font-black rounded-full shadow-2xl animate-pulse">
                  🔥 {product.badge}
                </div>
              )}

              {product.isFeatured && (
                <div className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white px-5 py-2.5 text-sm font-black rounded-full shadow-2xl flex items-center gap-2">
                  <Crown size={18} />
                  ⭐ Featured
                </div>
              )}

              {/* Bottom Action Buttons */}
              <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                <button
                  onClick={toggleWishlist}
                  className="flex-1 py-3 px-4 bg-white/95 backdrop-blur-md rounded-2xl hover:bg-white shadow-xl hover:scale-105 transition-all font-bold text-gray-900 flex items-center justify-center gap-2"
                >
                  <Heart size={20} fill={isWishlisted ? "#FF3B30" : "none"} className={isWishlisted ? "text-[#FF3B30]" : "text-gray-600"} />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
                <button
                  onClick={shareProduct}
                  className="py-3 px-4 bg-white/95 backdrop-blur-md rounded-2xl hover:bg-white shadow-xl hover:scale-105 transition-all"
                >
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Product Info Cards - Below Image */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                <p className="text-xs font-bold mb-1 opacity-90">ডায়মন্ড</p>
                <p className="text-2xl font-black">{product.diamonds.toLocaleString()}</p>
                <p className="text-[10px] opacity-75">Diamonds</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                <p className="text-xs font-bold mb-1 opacity-90">ক্যাটাগরি</p>
                <p className="text-lg font-black capitalize">{product.category}</p>
                <p className="text-[10px] opacity-75">Category</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                <p className="text-xs font-bold mb-1 opacity-90">ডেলিভারি</p>
                <p className="text-lg font-black">5-15 min</p>
                <p className="text-[10px] opacity-75">Delivery</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                <p className="text-xs font-bold mb-1 opacity-90">বিক্রয়</p>
                <p className="text-2xl font-black">{product.soldCount || 0}+</p>
                <p className="text-[10px] opacity-75">Sold</p>
              </div>
            </div>
          </div>

          {/* Right: Product Info & Buy Box - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Product Title Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-200">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">
                  {product.name}
                </h1>
                <p className="text-lg text-gray-600 font-bold mb-4">
                  {product.nameBn}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-100">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"} />
                    ))}
                  </div>
                  <span className="text-base font-black text-gray-900">{product.rating}</span>
                  <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer font-bold">
                    ({productReviews.length})
                  </span>
                </div>
              </div>

              {/* Price Card - Eye-catching */}
              <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 rounded-3xl p-6 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative">
                  <p className="text-sm text-white/90 font-bold mb-2">মূল্য / Price</p>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-5xl font-black text-white">৳{product.price}</span>
                  </div>
                  {originalPrice > product.price && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
                      <span className="text-white/80 line-through text-sm">৳{originalPrice}</span>
                      <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-lg text-xs font-black">
                        {discount}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 shadow-xl flex items-center gap-3">
                <CheckCircle size={28} className="text-white" />
                <div>
                  <p className="text-lg font-black text-white">স্টকে আছে</p>
                  <p className="text-xs text-white/80 font-bold">In Stock - Order Now!</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-gray-200">
                <label className="text-sm font-black text-gray-900 block mb-2">
                  পরিমাণ / Quantity
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={addToCart}
                  className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-600 hover:via-pink-600 hover:to-purple-600 text-white rounded-2xl py-4 px-6 text-base font-black shadow-2xl hover:shadow-3xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={22} />
                  কার্টে যোগ করুন
                </button>

                <button
                  onClick={buyNow}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl py-4 px-6 text-base font-black shadow-2xl hover:shadow-3xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Zap size={22} />
                  এখনই কিনুন
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 text-center border-2 border-blue-200">
                  <Shield size={20} className="text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] font-black text-gray-900">নিরাপদ</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center border-2 border-green-200">
                  <Zap size={20} className="text-green-600 mx-auto mb-1" />
                  <p className="text-[10px] font-black text-gray-900">দ্রুত</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center border-2 border-purple-200">
                  <Package size={20} className="text-purple-600 mx-auto mb-1" />
                  <p className="text-[10px] font-black text-gray-900">সহজ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Reviews - Modern Tabs */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden">
          {/* Tabs - Colorful */}
          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => setSelectedTab("details")}
              className={`flex-1 py-4 px-6 font-black text-sm transition-all ${selectedTab === "details"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <Info size={18} className="inline mr-2" />
              বিস্তারিত / Details
            </button>
            <button
              onClick={() => setSelectedTab("reviews")}
              className={`flex-1 py-4 px-6 font-black text-sm transition-all ${selectedTab === "reviews"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <MessageCircle size={18} className="inline mr-2" />
              রিভিউ / Reviews ({productReviews.length})
            </button>
            <button
              onClick={() => setSelectedTab("faq")}
              className={`flex-1 py-4 px-6 font-black text-sm transition-all ${selectedTab === "faq"
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <AlertCircle size={18} className="inline mr-2" />
              FAQ
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {selectedTab === "details" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <Package size={24} className="text-blue-600" />
                  পণ্যের বিবরণ / Product Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-xs text-gray-600 font-bold mb-1">ক্যাটাগরি / Category</p>
                    <p className="text-lg font-black text-blue-600 capitalize">{product.category}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                    <p className="text-xs text-gray-600 font-bold mb-1">ডায়মন্ড / Diamonds</p>
                    <p className="text-lg font-black text-purple-600">{product.diamonds.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                    <p className="text-xs text-gray-600 font-bold mb-1">ডেলিভারি / Delivery</p>
                    <p className="text-lg font-black text-green-600">5-15 মিনিট</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200">
                    <p className="text-xs text-gray-600 font-bold mb-1">স্টক / Stock</p>
                    <p className="text-lg font-black text-green-600">স্টকে আছে / In Stock</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                  <h3 className="font-black text-gray-900 mb-3 text-lg">বর্ণনা / Description</h3>
                  <div className="text-sm text-gray-700 space-y-2 leading-relaxed">
                    <p>{product.description || "High quality diamonds for your gaming account"}</p>
                    {product.descriptionBn && <p>{product.descriptionBn}</p>}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <h3 className="font-black text-gray-900 mb-4 text-lg flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    গুরুত্বপূর্ণ তথ্য / Important Information
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="font-bold">১০০% নিরাপদ এবং সুরক্ষিত লেনদেন / 100% secure and safe transaction</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="font-bold">৫-১৫ মিনিটের মধ্যে দ্রুত ডেলিভারি / Fast delivery within 5-15 minutes</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="font-bold">২৪/৭ কাস্টমার সাপোর্ট / 24/7 customer support available</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="font-bold">সেরা মূল্য গ্যারান্টি / Best price guarantee</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="font-bold">সমস্যা হলে রিফান্ডযোগ্য / Refundable if any issues occur</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {selectedTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-gray-900">কাস্টমার রিভিউ / Customer Reviews</h2>
                  {userData && (
                    <button
                      onClick={() => setReviewModalOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl text-sm font-black transition-all hover:scale-105 shadow-lg"
                    >
                      ✍️ রিভিউ লিখুন
                    </button>
                  )}
                </div>

                {/* Rating Summary - Colorful Style */}
                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-8 border-4 border-purple-200 shadow-xl">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="text-center bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200">
                      <div className="text-6xl font-black text-purple-600 mb-3">{product.rating}</div>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={24} className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"} />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 font-bold">{productReviews.length} রেটিং</div>
                    </div>
                    <div className="flex-1 w-full">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = productReviews.filter(r => r.rating === stars).length;
                        const percentage = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;
                        return (
                          <div key={stars} className="flex items-center gap-4 mb-3">
                            <span className="text-sm text-purple-600 hover:text-pink-600 cursor-pointer font-black w-16">
                              {stars} ⭐
                            </span>
                            <div className="flex-1 h-6 bg-white border-2 border-purple-200 rounded-full overflow-hidden shadow-inner">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-700 font-black w-12">{Math.round(percentage)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Reviews List - Modern Colorful Style */}
                <div className="space-y-4">
                  {productReviews.length === 0 ? (
                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-4 border-gray-200">
                      <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-black text-gray-600 mb-2">এখনও কোনো রিভিউ নেই!</p>
                      <p className="text-sm text-gray-500 font-bold">প্রথম রিভিউ লিখুন এবং অন্যদের সাহায্য করুন</p>
                    </div>
                  ) : (
                    productReviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-2xl p-6 border-4 border-gray-100 hover:border-purple-200 transition-all shadow-lg hover:shadow-xl">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg border-4 border-white">
                            {review.user_avatar ? (
                              <img src={review.user_avatar} alt={review.user_name} className="w-full h-full object-cover" />
                            ) : (
                              <Users size={24} className="text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-black text-base text-gray-900">{review.user_name}</span>
                              {review.is_verified && (
                                <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full font-black border-2 border-green-200">
                                  <BadgeCheck size={16} />
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={18}
                                    className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500 font-bold">
                                {new Date(review.created_at).toLocaleDateString('bn-BD', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-3">{review.comment}</p>
                            <div className="flex items-center gap-4">
                              <button className="text-sm text-purple-600 hover:text-pink-600 flex items-center gap-2 font-black hover:scale-105 transition-transform">
                                <ThumbsUp size={16} />
                                সহায়ক
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {selectedTab === "faq" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <AlertCircle size={28} className="text-orange-500" />
                  প্রশ্ন ও উত্তর / Questions & Answers
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      q: "ডেলিভারি কতক্ষণ সময় নেয়? / How long does delivery take?",
                      a: "অর্ডার নিশ্চিত হওয়ার পর সাধারণত ৫-১৫ মিনিটের মধ্যে ডেলিভারি হয়। আপনি সরাসরি আপনার গেম অ্যাকাউন্টে ডায়মন্ড পাবেন। / Delivery typically takes 5-15 minutes after order confirmation. You will receive the diamonds directly in your game account."
                    },
                    {
                      q: "পেমেন্ট কি নিরাপদ? / Is the payment secure?",
                      a: "হ্যাঁ, আমরা সম্পূর্ণ নিরাপদ পেমেন্ট গেটওয়ে ব্যবহার করি। আপনার তথ্য সম্পূর্ণভাবে সুরক্ষিত থাকে। / Yes, we use completely secure payment gateways. Your information is fully protected with industry-standard encryption."
                    },
                    {
                      q: "রিফান্ড পলিসি কী? / What is the refund policy?",
                      a: "যদি আপনার অর্ডারে কোনো সমস্যা হয়, আমরা ২৪ ঘন্টার মধ্যে রিফান্ড প্রসেস করব। গ্রাহক সন্তুষ্টি আমাদের অগ্রাধিকার। / If there are any issues with your order, we will process a refund within 24 hours. Customer satisfaction is our priority."
                    },
                    {
                      q: "কাস্টমার সাপোর্টে কীভাবে যোগাযোগ করব? / How can I contact customer support?",
                      a: "আমাদের ২৪/৭ কাস্টমার সাপোর্ট আছে। যেকোনো সাহায্যের জন্য আপনি কন্টাক্ট পেজ বা লাইভ চ্যাটের মাধ্যমে আমাদের সাথে যোগাযোগ করতে পারেন। / We have 24/7 customer support available. You can reach us through the contact page or live chat for any assistance."
                    },
                    {
                      q: "আমার পাসওয়ার্ড দিতে হবে কি? / Do I need to provide my password?",
                      a: "না, আপনাকে কখনোই পাসওয়ার্ড দিতে হবে না। ডায়মন্ড নিরাপদে ডেলিভার করতে আমাদের শুধু আপনার প্লেয়ার আইডি প্রয়োজন। / No, you never need to provide your password. We only need your Player ID to deliver the diamonds safely."
                    },
                  ].map((faq, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border-4 border-blue-200 hover:border-purple-300 transition-all shadow-lg hover:shadow-xl">
                      <div className="flex gap-4">
                        <span className="font-black text-blue-600 flex-shrink-0 text-xl">প্র:</span>
                        <div className="flex-1">
                          <p className="font-black text-gray-900 mb-3 text-base leading-relaxed">{faq.q}</p>
                          <div className="flex gap-4">
                            <span className="font-black text-green-600 flex-shrink-0 text-xl">উ:</span>
                            <p className="text-sm text-gray-700 leading-relaxed font-medium">{faq.a}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-4 border-orange-200 shadow-xl">
                  <h3 className="font-black text-gray-900 mb-3 text-xl flex items-center gap-2">
                    💬 আপনার কোনো প্রশ্ন আছে?
                  </h3>
                  <p className="text-sm text-gray-700 mb-5 font-medium leading-relaxed">
                    আপনি যে উত্তর খুঁজছেন তা খুঁজে পাচ্ছেন না? আমাদের কাস্টমার সাপোর্ট টিমের সাথে যোগাযোগ করুন। / Can't find the answer you're looking for? Please contact our customer support team.
                  </p>
                  <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-2xl text-base font-black transition-all hover:scale-105 shadow-lg flex items-center gap-2">
                    <MessageCircle size={20} />
                    প্রশ্ন করুন / Ask a Question
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSuccess={fetchReviews}
      />

      <CartSidebar
        cart={cart}
        isOpen={cartOpen}
        onClose={closeCart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
