import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import MobileLayout from '@/components/mobile-v2/MobileLayout';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function CartMobile() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('কার্ট খালি আছে');
      return;
    }
    navigate('/checkout');
  };

  const handleClearCart = () => {
    if (window.confirm('সব পণ্য মুছে ফেলবেন?')) {
      clearCart();
      toast.success('কার্ট খালি করা হয়েছে');
    }
  };

  return (
    <MobileLayout
      showAppBar={true}
      showNavBar={true}
      appBarProps={{
        title: 'কার্ট',
        subtitle: `${cart.length} টি পণ্য`,
        showBack: true,
        rightActions: cart.length > 0 ? (
          <button
            onClick={handleClearCart}
            className="p-2 rounded-xl text-red-500 active:bg-red-50 transition-colors"
          >
            <Trash2 size={22} />
          </button>
        ) : undefined,
      }}
    >
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={60} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">কার্ট খালি</h2>
          <p className="text-gray-600 text-center mb-8">
            আপনার কার্টে কোন পণ্য নেই
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/store')}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg"
          >
            <ShoppingBag size={22} />
            <span>কেনাকাটা শুরু করুন</span>
          </motion.button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="px-4 py-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="mobile-card p-4"
                >
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image || item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-gray-900 text-sm mb-1 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-lg font-black text-red-500 mb-2">
                        ৳{item.product.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
                        >
                          <Minus size={16} className="text-gray-700" />
                        </button>
                        <span className="w-10 text-center font-black text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center active:scale-95 transition-transform"
                        >
                          <Plus size={16} className="text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => {
                        removeFromCart(item.product.id);
                        toast.success('পণ্য মুছে ফেলা হয়েছে');
                      }}
                      className="p-2 rounded-xl text-red-500 active:bg-red-50 transition-colors self-start"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">সাবটোটাল</span>
                    <span className="text-base font-black text-gray-900">
                      ৳{item.product.price * item.quantity}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary Card */}
          <div className="px-4 pb-4">
            <div className="mobile-card p-4 bg-gradient-to-br from-gray-50 to-white">
              <h3 className="text-lg font-black text-gray-900 mb-4">অর্ডার সামারি</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">পণ্য ({cart.length})</span>
                  <span className="font-bold text-gray-900">৳{cartTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">ডেলিভারি চার্জ</span>
                  <span className="font-bold text-green-500">ফ্রি</span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-gray-900">মোট</span>
                  <span className="text-2xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    ৳{cartTotal}
                  </span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-2xl font-black shadow-lg"
              >
                <span>চেকআউট করুন</span>
                <ArrowRight size={22} />
              </motion.button>
            </div>
          </div>
        </>
      )}
    </MobileLayout>
  );
}
