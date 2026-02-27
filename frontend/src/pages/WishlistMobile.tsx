import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import MobileLayout from '@/components/mobile-v2/MobileLayout';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function WishlistMobile() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    console.log('📋 Wishlist loaded:', wishlist?.length || 0, 'items');
    console.log('📋 Wishlist data:', wishlist);
    console.log('📋 LocalStorage wishlist:', localStorage.getItem('wishlist'));
  }, [wishlist]);

  const handleAddToCart = (product: any) => {
    try {
      console.log('🛒 Adding to cart:', product);
      addToCart(product);
      toast.success('কার্টে যোগ করা হয়েছে!');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      toast.error('কার্টে যোগ করতে সমস্যা হয়েছে');
    }
  };

  const handleRemove = (productId: string) => {
    try {
      console.log('🗑️ Removing from wishlist:', productId);
      removeFromWishlist(productId);
      toast.success('উইশলিস্ট থেকে মুছে ফেলা হয়েছে');
    } catch (error) {
      console.error('❌ Error removing from wishlist:', error);
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const handleClearWishlist = () => {
    if (window.confirm('সব পণ্য মুছে ফেলবেন?')) {
      try {
        console.log('🗑️ Clearing wishlist');
        clearWishlist();
        toast.success('উইশলিস্ট খালি করা হয়েছে');
      } catch (error) {
        console.error('❌ Error clearing wishlist:', error);
        toast.error('খালি করতে সমস্যা হয়েছে');
      }
    }
  };

  return (
    <MobileLayout
      showAppBar={true}
      showNavBar={true}
      appBarProps={{
        title: 'উইশলিস্ট',
        subtitle: `${wishlist.length} টি পণ্য`,
        showBack: true,
        rightActions: wishlist.length > 0 ? (
          <button
            onClick={handleClearWishlist}
            className="p-2 rounded-xl text-red-500 active:bg-red-50 transition-colors"
          >
            <Trash2 size={22} />
          </button>
        ) : undefined,
      }}
    >
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Heart size={60} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">উইশলিস্ট খালি</h2>
          <p className="text-gray-600 text-center mb-8">
            আপনার পছন্দের পণ্য এখানে সেভ করুন
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/store')}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg"
          >
            <ShoppingCart size={22} />
            <span>কেনাকাটা শুরু করুন</span>
          </motion.button>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mobile-card p-4"
              >
                <div className="flex gap-3">
                  {/* Image */}
                  <div 
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src={item.image || item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="font-black text-gray-900 text-sm mb-1 line-clamp-2 cursor-pointer"
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                      {item.nameBn || item.name_bn}
                    </p>
                    <p className="text-xl font-black text-red-500 mb-3">
                      ৳{item.price}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                      >
                        <ShoppingCart size={16} />
                        <span>কার্ট</span>
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-500 active:bg-red-100 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </MobileLayout>
  );
}
