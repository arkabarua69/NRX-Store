import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Package, Sparkles } from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/lib/types";
import { toast } from "sonner";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Cart() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useState(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  });

  const updateQuantity = (productId: string, change: number) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
      
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const updated = prev.filter(item => item.product.id !== productId);
      localStorage.setItem('cart', JSON.stringify(updated));
      toast.success("কার্ট থেকে সরানো হয়েছে!");
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    toast.success("কার্ট খালি করা হয়েছে!");
  };

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      toast.error("চেকআউট করতে লগইন করুন!");
      navigate("/login");
      return;
    }
    
    if (cart.length === 0) {
      toast.error("কার্ট খালি!");
      return;
    }

    navigate("/checkout", { state: { cartItems: cart } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar cartCount={itemCount} />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-xl bg-white hover:bg-gray-100 transition-colors shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900">শপিং কার্ট</h1>
              <p className="text-gray-500 font-semibold">{itemCount} items in cart</p>
            </div>
          </div>
          
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-2 rounded-xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors"
            >
              সব মুছে ফেলুন
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">কার্ট খালি</h2>
            <p className="text-gray-500 mb-8">Your cart is empty. Start shopping!</p>
            <button
              onClick={() => navigate("/store")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF3B30] to-[#FF6B30] text-white font-bold hover:shadow-lg hover:shadow-red-200 transition-all flex items-center gap-2"
            >
              <Package size={20} />
              শপিং শুরু করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-black text-gray-900">{item.product.name}</h3>
                          <p className="text-sm text-gray-500 font-semibold">{item.product.nameBn}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-lg">
                          <Sparkles size={14} className="text-amber-500" />
                          <span className="text-sm font-bold text-amber-700">
                            {item.product.diamonds} Diamonds
                          </span>
                        </div>
                        <span className="text-2xl font-black text-[#FF3B30]">৳{item.product.price}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-[#FF3B30] hover:text-white hover:border-[#FF3B30] transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-[#FF3B30] hover:text-white hover:border-[#FF3B30] transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-500 font-semibold">Subtotal</p>
                          <p className="text-xl font-black text-gray-900">
                            ৳{item.product.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-black text-gray-900 mb-6">অর্ডার সামারি</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Subtotal ({itemCount} items)</span>
                    <span className="font-bold text-gray-900">৳{total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Delivery</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-lg font-black text-gray-900">মোট (Total)</span>
                    <span className="text-2xl font-black text-[#FF3B30]">৳{total}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF3B30] to-[#FF6B30] text-white font-black text-lg hover:shadow-lg hover:shadow-red-200 hover:scale-105 transition-all flex items-center justify-center gap-2 mb-4"
                >
                  <ShoppingCart size={20} />
                  চেকআউট করুন
                </button>

                <button
                  onClick={() => navigate("/store")}
                  className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  শপিং চালিয়ে যান
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <span className="text-green-600">✓</span>
                    </div>
                    <span className="text-gray-600 font-semibold">নিরাপদ পেমেন্ট</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <span className="text-blue-600">⚡</span>
                    </div>
                    <span className="text-gray-600 font-semibold">দ্রুত ডেলিভারি (5-30 মিনিট)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                      <span className="text-purple-600">24/7</span>
                    </div>
                    <span className="text-gray-600 font-semibold">সাপোর্ট উপলব্ধ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
