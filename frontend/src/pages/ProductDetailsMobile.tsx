import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Heart, Star, Diamond, Zap, 
  Shield, Clock, Users, Package, CheckCircle 
} from 'lucide-react';
import MobileLayout from '@/components/mobile-v2/MobileLayout';
import { getProductById } from '@/lib/productService';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/lib/types';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ProductDetailsMobile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = wishlist.some(item => item.id === product?.id);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await getProductById(id!);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('পণ্য লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success('কার্টে যোগ করা হয়েছে!');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  const handleWishlist = () => {
    if (product) {
      if (isWishlisted) {
        removeFromWishlist(product.id);
        toast.success('উইশলিস্ট থেকে মুছে ফেলা হয়েছে');
      } else {
        addToWishlist(product);
        toast.success('উইশলিস্টে যোগ করা হয়েছে');
      }
    }
  };

  if (loading) {
    return (
      <MobileLayout
        showAppBar={true}
        showNavBar={false}
        appBarProps={{
          title: 'পণ্য বিস্তারিত',
          showBack: true,
        }}
      >
        <div className="space-y-4 p-4">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="skeleton h-8 rounded-xl" />
          <div className="skeleton h-20 rounded-xl" />
          <div className="skeleton h-40 rounded-xl" />
        </div>
      </MobileLayout>
    );
  }

  if (!product) {
    return (
      <MobileLayout
        showAppBar={true}
        showNavBar={false}
        appBarProps={{
          title: 'পণ্য বিস্তারিত',
          showBack: true,
        }}
      >
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <Package size={60} className="text-gray-400 mb-4" />
          <h2 className="text-xl font-black text-gray-900 mb-2">পণ্য পাওয়া যায়নি</h2>
          <button
            onClick={() => navigate('/store')}
            className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold"
          >
            স্টোরে ফিরে যান
          </button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      showAppBar={true}
      showNavBar={false}
      appBarProps={{
        title: '',
        showBack: true,
        transparent: true,
        rightActions: (
          <button
            onClick={handleWishlist}
            className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg active:scale-95 transition-transform"
          >
            <Heart
              size={22}
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}
            />
          </button>
        ),
      }}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={product.image || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.badge && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-lg">
              {product.badge}
            </div>
          )}
          {product.isFeatured && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-lg">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            {product.rating || 4.5}
          </div>
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold">
            <Users size={14} className="text-green-500" />
            {product.soldCount || 0} বিক্রি
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Title & Price */}
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
            {product.name}
          </h1>
          <p className="text-base text-gray-600 mb-4">
            {product.nameBn || product.name_bn}
          </p>
          
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">মূল্য</p>
              <p className="text-3xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                ৳{product.price}
              </p>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div>
              <p className="text-xs text-gray-600 mb-1">ডায়মন্ড</p>
              <p className="text-2xl font-black text-gray-900 flex items-center gap-1">
                {product.diamonds}
                <Diamond size={20} className="text-red-500" />
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          <div className="mobile-card p-3 text-center">
            <Shield size={24} className="text-green-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-900">১০০% নিরাপদ</p>
          </div>
          <div className="mobile-card p-3 text-center">
            <Clock size={24} className="text-blue-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-900">দ্রুত ডেলিভারি</p>
          </div>
          <div className="mobile-card p-3 text-center">
            <CheckCircle size={24} className="text-purple-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-900">যাচাইকৃত</p>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mobile-card p-4">
            <h3 className="text-lg font-black text-gray-900 mb-3">বিবরণ</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Category */}
        <div className="mobile-card p-4">
          <h3 className="text-lg font-black text-gray-900 mb-3">ক্যাটাগরি</h3>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm">
            <Package size={16} />
            {product.category || 'General'}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom z-50">
        <div className="flex items-center gap-3">
          {/* Quantity */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center active:bg-gray-200 transition-colors"
            >
              <span className="text-lg font-bold text-gray-700">−</span>
            </button>
            <span className="w-10 text-center font-black text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="text-lg font-bold text-white">+</span>
            </button>
          </div>

          {/* Add to Cart */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl font-bold"
          >
            <ShoppingCart size={20} />
            <span>কার্ট</span>
          </motion.button>

          {/* Buy Now */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-xl font-bold shadow-lg"
          >
            <Zap size={20} />
            <span>কিনুন</span>
          </motion.button>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-24" />
    </MobileLayout>
  );
}
