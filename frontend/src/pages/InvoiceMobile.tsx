import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Download, CheckCircle, Clock, Package,
  User, Mail, Hash, Diamond, Copy,
  FileText, Shield, Award, Sparkles, CreditCard, Share2, Upload
} from "lucide-react";
import MobileLayout from "@/components/mobile-v2/MobileLayout";
import { getOrderById } from "@/lib/orderService";
import { Order } from "@/lib/types";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function InvoiceMobile() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const data = await getOrderById(orderId!);
      
      if (!data) {
        setOrder(null);
        setLoading(false);
        return;
      }
      
      console.log("Invoice order data:", data);
      
      // Extract product data from nested topup_packages
      const productData = data.topup_packages || {};
      const gameData = productData.games || {};
      
      // Map backend data to frontend Order type
      const mappedOrder: Order = {
        id: data.id,
        user_id: data.user_id,
        product_id: data.product_id,
        productName: productData.name || data.product_name || data.productName || 'Unknown Product',
        diamonds: productData.diamonds || data.diamonds || 0,
        total_amount: data.total_amount || data.unit_price || data.price || 0,
        player_id: data.player_id || data.gameId || '',
        userName: data.player_name || data.userName || 'Customer',
        userEmail: data.contact_email || data.userEmail || '',
        phoneNumber: data.contact_phone || data.phoneNumber || '',
        paymentMethod: data.payment_method || data.paymentMethod || '',
        transactionId: data.transaction_id || data.transactionId || '',
        status: data.status || 'pending',
        verificationStatus: data.verification_status || data.verificationStatus || 'pending',
        topupStatus: (data.delivery_status === 'processing' ? 'pending' : data.delivery_status) as 'pending' | 'completed' | 'failed' | undefined,
        paymentProofImage: data.payment_proof_url || data.paymentProofImage || '',
        adminNotes: data.admin_notes || data.adminNotes || '',
        created_at: data.created_at || data.createdAt || new Date().toISOString(),
        quantity: data.quantity || 1,
        unit_price: data.unit_price || data.price || 0,
        productImage: productData.image_url || data.product_image || data.productImage || data.image_url || '',
        image: productData.image_url || data.product_image || data.image_url || data.productImage || '',
        gameName: gameData.name || data.game_name || '',
      };
      
      console.log("Mapped order:", mappedOrder);
      setOrder(mappedOrder);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Invoice লোড করতে সমস্যা হয়েছে");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!order) return;
    
    const invoiceText = `
═══════════════════════════════════════════════════════
                NRX DIAMOND STORE
              Official Invoice / রসিদ
═══════════════════════════════════════════════════════

Invoice Number: ${order.id}
Date: ${new Date(order.created_at).toLocaleDateString('bn-BD')}
Time: ${new Date(order.created_at).toLocaleTimeString('bn-BD')}

───────────────────────────────────────────────────────
CUSTOMER INFORMATION / গ্রাহক তথ্য
───────────────────────────────────────────────────────
Name: ${order.userName}
Email: ${order.userEmail}
Game ID: ${order.player_id}
Phone: ${order.phoneNumber || 'N/A'}

───────────────────────────────────────────────────────
ORDER DETAILS / অর্ডার বিবরণ
───────────────────────────────────────────────────────
Product: ${order.productName}
Diamonds: ${order.diamonds} 💎
Price: ৳${order.total_amount}

───────────────────────────────────────────────────────
PAYMENT INFORMATION / পেমেন্ট তথ্য
───────────────────────────────────────────────────────
Method: ${order.paymentMethod?.toUpperCase()}
Transaction ID: ${order.transactionId}
Status: ${order.status.toUpperCase()}
Verification: ${order.verificationStatus?.toUpperCase()}

───────────────────────────────────────────────────────
DELIVERY STATUS / ডেলিভারি স্ট্যাটাস
───────────────────────────────────────────────────────
Topup Status: ${order.topupStatus?.toUpperCase() || 'PENDING'}

───────────────────────────────────────────────────────
TOTAL AMOUNT / মোট মূল্য
───────────────────────────────────────────────────────
Subtotal: ৳${order.total_amount}
Service Fee: ৳0 (FREE)
───────────────────────────────────────────────────────
TOTAL: ৳${order.total_amount}
───────────────────────────────────────────────────────

═══════════════════════════════════════════════════════
Thank you for your purchase!
ক্রয়ের জন্য ধন্যবাদ!

Support: +8801883800356
Email: support@nrxstore.com
Website: nrxstore.com
═══════════════════════════════════════════════════════
`;

    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Invoice ডাউনলোড হয়েছে!");
  };

  const handleShare = async () => {
    if (!order) return;
    
    const shareText = `NRX Store Invoice\n\nOrder ID: ${order.id}\nProduct: ${order.productName}\nDiamonds: ${order.diamonds} 💎\nAmount: ৳${order.total_amount}\nStatus: ${order.status.toUpperCase()}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NRX Store Invoice',
          text: shareText,
        });
        toast.success("শেয়ার করা হয়েছে!");
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("কপি হয়েছে!");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("কপি হয়েছে!");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "from-yellow-400 to-yellow-500",
      processing: "from-blue-400 to-blue-500",
      completed: "from-green-400 to-green-500",
      cancelled: "from-red-400 to-red-500",
      failed: "from-red-400 to-red-500",
      verified: "from-green-400 to-green-500",
      rejected: "from-red-400 to-red-500",
    };
    return colors[status] || "from-gray-400 to-gray-500";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      pending: <Clock size={18} />,
      processing: <Package size={18} className="animate-pulse" />,
      completed: <CheckCircle size={18} />,
      cancelled: <span className="text-lg">✕</span>,
      failed: <span className="text-lg">✕</span>,
      verified: <CheckCircle size={18} />,
      rejected: <span className="text-lg">✕</span>,
    };
    return icons[status] || <Clock size={18} />;
  };

  if (loading) {
    return (
      <MobileLayout showAppBar={true} showNavBar={false} appBarProps={{ title: "Invoice", showBack: true }}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-red-100 rounded-full animate-ping" />
              <div className="absolute inset-0 border-4 border-t-red-500 border-r-red-400 border-b-red-300 border-l-red-200 rounded-full animate-spin" />
            </div>
            <p className="text-gray-800 font-bold text-lg">Invoice লোড হচ্ছে...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!order) {
    return (
      <MobileLayout showAppBar={true} showNavBar={false} appBarProps={{ title: "Invoice", showBack: true }}>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Invoice পাওয়া যায়নি</h2>
            <p className="text-gray-600 mb-6">এই অর্ডারটি খুঁজে পাওয়া যায়নি</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold shadow-lg"
            >
              ড্যাশবোর্ডে ফিরে যান
            </motion.button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      showAppBar={true}
      showNavBar={false}
      appBarProps={{
        title: "Invoice",
        showBack: true,
        rightActions: (
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-gray-700 active:bg-gray-100 transition-colors"
            >
              <Share2 size={22} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl text-gray-700 active:bg-gray-100 transition-colors"
            >
              <Download size={22} />
            </button>
          </div>
        ),
      }}
    >
      <div className="px-4 py-6 space-y-4">
        {/* Header Card */}
        <div className="mobile-card p-6 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Diamond size={32} />
              <div>
                <h1 className="text-2xl font-black">NRX STORE</h1>
                <p className="text-white/90 text-sm font-semibold">Official Invoice</p>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor(order.status)} text-white font-bold shadow-lg`}>
              {getStatusIcon(order.status)}
              <span className="uppercase text-sm">{order.status}</span>
            </div>
          </div>
        </div>

        {/* Invoice Number & Date */}
        <div className="mobile-card p-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 font-semibold mb-1">Invoice Number</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-black font-mono text-gray-900">{order.id.slice(0, 16)}...</p>
                <button
                  onClick={() => handleCopy(order.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <Copy size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-1">Date</p>
                <p className="text-sm font-black text-gray-900">
                  {new Date(order.created_at).toLocaleDateString('bn-BD')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-1">Time</p>
                <p className="text-sm font-black text-gray-900">
                  {new Date(order.created_at).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mobile-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User size={18} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-black text-gray-900">গ্রাহক তথ্য</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User size={16} className="text-gray-600" />
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-semibold">Name</p>
                <p className="text-sm font-black text-gray-900">{order.userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-600" />
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-semibold">Email</p>
                <p className="text-sm font-black text-gray-900 break-all">{order.userEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Hash size={16} className="text-gray-600" />
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-semibold">Game ID</p>
                <p className="text-sm font-black text-gray-900">{order.player_id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="mobile-card p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package size={18} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-black text-gray-900">অর্ডার বিবরণ</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Product Image */}
            <div className="w-20 h-20 bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 border-2 border-purple-200">
              {order.productImage || order.image ? (
                <img
                  src={order.productImage || order.image}
                  alt={order.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to diamond icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-600"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"></path></svg></div>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Diamond size={32} className="text-purple-600" />
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 mb-1 line-clamp-2">{order.productName}</p>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-600 font-semibold">Quantity:</span>
                <span className="text-xs font-black text-gray-900">{order.quantity}</span>
              </div>
              <div className="flex items-center gap-1">
                <Diamond size={14} className="text-purple-600" />
                <span className="text-sm font-black text-purple-600">{order.diamonds} Diamonds</span>
              </div>
            </div>
            
            {/* Price */}
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-black text-purple-600">৳{order.total_amount}</p>
              <p className="text-xs text-purple-600 font-bold">মূল্য</p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mobile-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard size={18} className="text-green-600" />
            </div>
            <h2 className="text-lg font-black text-gray-900">পেমেন্ট তথ্য</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-semibold">Payment Method</span>
              <span className="text-sm font-black text-gray-900 uppercase">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-semibold">Transaction ID</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-gray-900 font-mono">{order.transactionId}</span>
                <button
                  onClick={() => handleCopy(order.transactionId || '')}
                  className="p-1 rounded hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <Copy size={14} className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-semibold">Verification</span>
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(order.verificationStatus || 'pending')} text-white text-xs font-bold`}>
                {getStatusIcon(order.verificationStatus || 'pending')}
                <span className="uppercase">{order.verificationStatus || 'pending'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-semibold">Topup Status</span>
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(order.topupStatus || 'pending')} text-white text-xs font-bold`}>
                {getStatusIcon(order.topupStatus || 'pending')}
                <span className="uppercase">{order.topupStatus || 'pending'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Proof */}
        {order.paymentProofImage ? (
          <div className="mobile-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText size={18} className="text-yellow-600" />
              </div>
              <h2 className="text-lg font-black text-gray-900">পেমেন্ট প্রুফ</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 mb-3">
              <img
                src={order.paymentProofImage}
                alt="Payment Proof"
                className="w-full rounded-lg shadow-md"
              />
            </div>
            {/* Re-upload button */}
            <button
              onClick={() => navigate(`/payment-proof/${order.id}`)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-transform"
            >
              <Upload size={18} />
              <span>নতুন প্রুফ আপলোড করুন</span>
            </button>
          </div>
        ) : (
          <div className="mobile-card p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <Upload size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-gray-900 mb-1">পেমেন্ট প্রুফ আপলোড করুন</h3>
                <p className="text-sm text-gray-600">পেমেন্ট করার পর স্ক্রিনশট আপলোড করুন</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/payment-proof/${order.id}`)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-black shadow-lg active:scale-95 transition-transform"
            >
              <Upload size={20} />
              <span>এখনই আপলোড করুন</span>
            </button>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="mobile-card p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <CreditCard size={18} className="text-red-600" />
            </div>
            <h2 className="text-lg font-black text-gray-900">মূল্য বিবরণ</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-semibold">Subtotal</span>
              <span className="text-gray-900 font-black">৳{order.total_amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-semibold">Service Fee</span>
              <span className="text-green-600 font-black">৳0 (FREE)</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-black text-gray-900">Total</span>
              <span className="text-2xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                ৳{order.total_amount}
              </span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          <div className="mobile-card p-3 bg-green-50 border-2 border-green-200">
            <Shield size={20} className="text-green-600 mx-auto mb-2" />
            <p className="text-xs text-green-700 font-bold text-center">১০০% নিরাপদ</p>
          </div>
          <div className="mobile-card p-3 bg-blue-50 border-2 border-blue-200">
            <Award size={20} className="text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-blue-700 font-bold text-center">দ্রুত ডেলিভারি</p>
          </div>
          <div className="mobile-card p-3 bg-purple-50 border-2 border-purple-200">
            <Sparkles size={20} className="text-purple-600 mx-auto mb-2" />
            <p className="text-xs text-purple-700 font-bold text-center">২৪/৭ সাপোর্ট</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 py-4">
          <p className="font-semibold mb-2">ক্রয়ের জন্য ধন্যবাদ!</p>
          <p className="text-xs">Support: +8801883800356</p>
          <p className="text-xs">Email: support@nrxstore.com</p>
        </div>
      </div>
    </MobileLayout>
  );
}
