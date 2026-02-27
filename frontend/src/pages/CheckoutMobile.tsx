import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import MobileLayout from '@/components/mobile-v2/MobileLayout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createOrder } from '@/lib/orderService';
import { API_URL } from '@/lib/config';

export default function CheckoutMobile() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [gameId, setGameId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentNumbers, setPaymentNumbers] = useState<any>(null);

  useEffect(() => {
    fetchPaymentNumbers();
  }, []);

  const fetchPaymentNumbers = async () => {
    try {
      const response = await fetch(`${API_URL}/settings`);
      if (response.ok) {
        const result = await response.json();
        setPaymentNumbers(result.data?.paymentMethods || null);
      }
    } catch (error) {
      console.error('Error fetching payment numbers:', error);
    }
  };

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.success('নাম্বার কপি হয়েছে!');
  };

  const paymentMethods = [
    { id: 'bkash', name: 'bKash', icon: Smartphone, color: 'from-pink-500 to-pink-600' },
    { id: 'nagad', name: 'Nagad', icon: CreditCard, color: 'from-orange-500 to-red-500' },
    { id: 'rocket', name: 'Rocket', icon: Building2, color: 'from-purple-500 to-purple-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('লগইন করুন');
      navigate('/login');
      return;
    }

    if (!gameId.trim()) {
      toast.error('গেম আইডি দিন');
      return;
    }

    if (!transactionId.trim()) {
      toast.error('ট্রানজেকশন আইডি দিন');
      return;
    }

    if (cart.length === 0) {
      toast.error('কার্ট খালি আছে');
      return;
    }

    setLoading(true);

    try {
      console.log('📦 Creating order...');
      console.log('User:', user);
      console.log('Cart:', cart);

      const result = await createOrder(
        user.id,
        user.email || '',
        user.name || 'User',
        {
          productId: cart[0].product.id,
          gameId: gameId.trim(),
          paymentMethod: paymentMethod,
          transactionId: transactionId.trim(),
          phoneNumber: '',
        },
        {
          name: cart[0].product.name,
          diamonds: cart[0].product.diamonds || 0,
          price: cartTotal,
        }
      );

      console.log('✅ Order created with ID:', result);

      if (result) {
        clearCart();
        toast.success('অর্ডার সফল হয়েছে!');
        navigate(`/invoice/${result}`);
      } else {
        toast.error('অর্ডার করতে সমস্যা হয়েছে');
      }
    } catch (error: any) {
      console.error('❌ Order error:', error);
      toast.error(error.message || 'অর্ডার করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <MobileLayout
        showAppBar={true}
        showNavBar={true}
        appBarProps={{
          title: 'চেকআউট',
          showBack: true,
        }}
      >
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={48} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">কার্ট খালি</h2>
          <p className="text-gray-600 text-center mb-6">
            চেকআউট করার জন্য কার্টে পণ্য যোগ করুন
          </p>
          <button
            onClick={() => navigate('/store')}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold"
          >
            স্টোরে যান
          </button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      showAppBar={true}
      showNavBar={true}
      appBarProps={{
        title: 'চেকআউট',
        showBack: true,
      }}
    >
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Order Summary */}
        <div className="mobile-card p-4">
          <h3 className="text-lg font-black text-gray-900 mb-4">অর্ডার সামারি</h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product.image || item.product.imageUrl} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">পরিমাণ: {item.quantity}</p>
                  <p className="text-xs text-gray-600">ডায়মন্ড: {item.product.diamonds || 0}</p>
                </div>
                <p className="font-black text-red-500 text-sm">৳{item.product.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="pt-3 mt-3 border-t-2 border-gray-200 flex items-center justify-between">
            <span className="text-lg font-black text-gray-900">মোট</span>
            <span className="text-2xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              ৳{cartTotal}
            </span>
          </div>
        </div>

        {/* Game ID */}
        <div className="mobile-card p-4">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            গেম আইডি <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="আপনার গেম আইডি লিখুন"
            className="mobile-input"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            যে আইডিতে ডায়মন্ড পাঠাতে হবে
          </p>
        </div>

        {/* Payment Method */}
        <div className="mobile-card p-4">
          <label className="block text-sm font-bold text-gray-900 mb-3">
            পেমেন্ট মেথড <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <motion.button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all
                    ${isSelected 
                      ? `bg-gradient-to-br ${method.color} border-transparent text-white` 
                      : 'bg-white border-gray-200 text-gray-700'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  )}
                  <Icon size={24} className="mx-auto mb-2" />
                  <p className="text-xs font-bold">{method.name}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Payment Instructions */}
        {paymentNumbers && paymentNumbers[paymentMethod] && (
          <div className="mobile-card p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <AlertCircle size={18} />
              পেমেন্ট নির্দেশনা
            </h4>
            
            {/* Payment Number */}
            <div className="bg-white rounded-xl p-4 mb-3 border-2 border-green-200">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Send Money Number:</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-black text-gray-900 font-mono">
                  {paymentNumbers[paymentMethod].number}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyNumber(paymentNumbers[paymentMethod].number)}
                  className="p-2 bg-green-100 text-green-600 rounded-lg active:scale-95 transition-transform"
                >
                  <Copy size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Type: {paymentNumbers[paymentMethod].type}
              </p>
            </div>

            {/* Instructions */}
            <ol className="text-sm text-green-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-black">১.</span>
                <span>উপরের নম্বরে <span className="font-black">{paymentMethod.toUpperCase()}</span> দিয়ে Send Money করুন</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black">২.</span>
                <span><span className="font-black text-red-600">৳{cartTotal}</span> টাকা পাঠান</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black">৩.</span>
                <span>ট্রানজেকশন আইডি নিচে লিখুন</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black">৪.</span>
                <span>পেমেন্ট প্রুফ পরে আপলোড করতে পারবেন</span>
              </li>
            </ol>
          </div>
        )}

        {/* Transaction ID */}
        <div className="mobile-card p-4">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            ট্রানজেকশন আইডি <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="TXN123456789"
            className="mobile-input"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            পেমেন্ট করার পর যে আইডি পাবেন
          </p>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-2xl font-black shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <span>প্রসেস হচ্ছে...</span>
          ) : (
            <>
              <CheckCircle size={22} />
              <span>অর্ডার কনফার্ম করুন</span>
            </>
          )}
        </motion.button>
      </form>
    </MobileLayout>
  );
}
