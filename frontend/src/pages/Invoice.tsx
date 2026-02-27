import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Download, Printer, CheckCircle, Clock, Package,
  User, Mail, Phone, Hash, Diamond, ArrowLeft, Copy,
  FileText, Shield, Award, Sparkles, CreditCard
} from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";
import { getOrderById } from "@/lib/orderService";
import { Order } from "@/lib/types";
import { toast } from "sonner";

export default function Invoice() {
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
      
      // Map backend data to frontend Order type
      const mappedOrder: Order = {
        id: data.id,
        userId: data.user_id || data.userId,
        productId: data.product_id || data.productId,
        productName: data.topup_packages?.name || data.product_name || data.productName || 'Unknown Product',
        diamonds: data.topup_packages?.diamonds || data.diamonds || 0,
        price: data.total_amount || data.unit_price || data.price || 0,
        gameId: data.player_id || data.gameId || '',
        userName: data.player_name || data.userName || 'Customer',
        userEmail: data.contact_email || data.userEmail || '',
        phoneNumber: data.contact_phone || data.phoneNumber || '',
        paymentMethod: data.payment_method || data.paymentMethod || '',
        transactionId: data.transaction_id || data.transactionId || '',
        status: data.status || 'pending',
        verificationStatus: data.verification_status || data.verificationStatus || 'pending',
        topupStatus: data.delivery_status || data.topupStatus || 'pending',
        paymentProofImage: data.payment_proof_url || data.paymentProofImage || '',
        adminNotes: data.admin_notes || data.adminNotes || '',
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
        topupTransactionId: data.topup_transaction_id || data.topupTransactionId,
        topupCompletedAt: data.delivered_at || data.topupCompletedAt,
      };
      
      setOrder(mappedOrder);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Invoice লোড করতে সমস্যা হয়েছে");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!order) return;
    
    const invoiceText = `
═══════════════════════════════════════════════════════
                NRX DIAMOND STORE
              Official Invoice / রসিদ
═══════════════════════════════════════════════════════

Invoice Number: ${order.id}
Date: ${new Date(order.createdAt).toLocaleDateString('bn-BD')}
Time: ${new Date(order.createdAt).toLocaleTimeString('bn-BD')}

───────────────────────────────────────────────────────
CUSTOMER INFORMATION / গ্রাহক তথ্য
───────────────────────────────────────────────────────
Name: ${order.userName}
Email: ${order.userEmail}
Game ID: ${order.gameId}
Phone: ${order.phoneNumber || 'N/A'}

───────────────────────────────────────────────────────
ORDER DETAILS / অর্ডার বিবরণ
───────────────────────────────────────────────────────
Product: ${order.productName}
Diamonds: ${order.diamonds} 💎
Price: ৳${order.price}

───────────────────────────────────────────────────────
PAYMENT INFORMATION / পেমেন্ট তথ্য
───────────────────────────────────────────────────────
Method: ${order.paymentMethod.toUpperCase()}
Transaction ID: ${order.transactionId}
Status: ${order.status.toUpperCase()}
Verification: ${order.verificationStatus.toUpperCase()}

───────────────────────────────────────────────────────
DELIVERY STATUS / ডেলিভারি স্ট্যাটাস
───────────────────────────────────────────────────────
Topup Status: ${order.topupStatus?.toUpperCase() || 'PENDING'}
${order.topupTransactionId ? `Topup Transaction: ${order.topupTransactionId}` : ''}
${order.topupCompletedAt ? `Completed At: ${new Date(order.topupCompletedAt).toLocaleString('bn-BD')}` : ''}

───────────────────────────────────────────────────────
TOTAL AMOUNT / মোট মূল্য
───────────────────────────────────────────────────────
Subtotal: ৳${order.price}
Service Fee: ৳0 (FREE)
───────────────────────────────────────────────────────
TOTAL: ৳${order.price}
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("কপি হয়েছে!");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      processing: "bg-blue-100 text-blue-800 border-blue-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
      failed: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      pending: <Clock size={16} />,
      processing: <Package size={16} className="animate-pulse" />,
      completed: <CheckCircle size={16} />,
      cancelled: <span className="text-lg">✕</span>,
      failed: <span className="text-lg">✕</span>,
    };
    return icons[status] || <Clock size={16} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-red-100 rounded-full animate-ping" />
              <div className="absolute inset-0 border-4 border-t-red-500 border-r-red-400 border-b-red-300 border-l-red-200 rounded-full animate-spin" />
            </div>
            <p className="text-gray-800 font-bold text-lg">Invoice লোড হচ্ছে...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FileText size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-gray-900 mb-2">Invoice পাওয়া যায়নি</h2>
            <p className="text-gray-600 mb-6">এই অর্ডারটি খুঁজে পাওয়া যায়নি</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />
      
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <div className="flex items-center justify-between mb-6 no-print">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-bold transition-colors"
          >
            <ArrowLeft size={20} />
            ড্যাশবোর্ডে ফিরে যান
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              <Download size={18} />
              ডাউনলোড
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <Printer size={18} />
              প্রিন্ট
            </button>
          </div>
        </div>

        <div id="invoice-content" className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                    <Diamond size={36} />
                    NRX STORE
                  </h1>
                  <p className="text-white/90 font-semibold">Official Invoice / রসিদ</p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold ${getStatusColor(order.status)} bg-white`}>
                    {getStatusIcon(order.status)}
                    <span className="uppercase">{order.status}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/70 text-sm font-semibold mb-1">Invoice Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black font-mono">{order.id.slice(0, 12)}...</p>
                    <button
                      onClick={() => handleCopy(order.id)}
                      className="p-1 hover:bg-white/20 rounded transition-colors no-print"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm font-semibold mb-1">Date & Time</p>
                  <p className="text-lg font-black">
                    {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                  </p>
                  <p className="text-sm font-semibold text-white/90">
                    {new Date(order.createdAt).toLocaleTimeString('bn-BD')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900">গ্রাহক তথ্য</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <User size={18} className="text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Name</p>
                    <p className="text-sm font-black text-gray-900">{order.userName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Mail size={18} className="text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Email</p>
                    <p className="text-sm font-black text-gray-900">{order.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Hash size={18} className="text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Game ID</p>
                    <p className="text-sm font-black text-gray-900">{order.gameId}</p>
                  </div>
                </div>
                {order.phoneNumber && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Phone size={18} className="text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Phone</p>
                      <p className="text-sm font-black text-gray-900">{order.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package size={20} className="text-purple-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900">অর্ডার বিবরণ</h2>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                      <Diamond size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Product</p>
                      <p className="text-lg font-black text-gray-900">{order.productName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 font-semibold">Diamonds</p>
                    <p className="text-2xl font-black text-purple-600">{order.diamonds} 💎</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard size={20} className="text-green-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900">পেমেন্ট তথ্য</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-2">Payment Method</p>
                  <p className="text-lg font-black text-gray-900 uppercase">{order.paymentMethod}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-2">Transaction ID</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-gray-900 font-mono">{order.transactionId}</p>
                    <button
                      onClick={() => handleCopy(order.transactionId)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors no-print"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-2">Verification Status</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 font-bold ${getStatusColor(order.verificationStatus)}`}>
                    {getStatusIcon(order.verificationStatus)}
                    <span className="uppercase text-sm">{order.verificationStatus}</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-2">Topup Status</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 font-bold ${getStatusColor(order.topupStatus || 'pending')}`}>
                    {getStatusIcon(order.topupStatus || 'pending')}
                    <span className="uppercase text-sm">{order.topupStatus || 'pending'}</span>
                  </div>
                </div>
              </div>
            </div>

            {order.paymentProofImage && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <FileText size={20} className="text-yellow-600" />
                  </div>
                  <h2 className="text-xl font-black text-gray-900">পেমেন্ট প্রুফ</h2>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <img
                    src={order.paymentProofImage}
                    alt="Payment Proof"
                    className="max-h-64 mx-auto rounded-xl shadow-lg"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <CreditCard size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900">মূল্য বিবরণ</h2>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Subtotal</span>
                    <span className="text-gray-900 font-black">৳{order.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Service Fee</span>
                    <span className="text-green-600 font-black">৳0 (FREE)</span>
                  </div>
                  <div className="pt-3 border-t-2 border-gray-200 flex justify-between items-center">
                    <span className="text-xl font-black text-gray-900">Total Amount</span>
                    <span className="text-3xl font-black text-red-600">৳{order.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <Shield size={24} className="text-green-600" />
                  <div>
                    <p className="text-xs text-green-700 font-semibold">১০০% নিরাপদ</p>
                    <p className="text-sm font-black text-green-900">Secure Payment</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <Award size={24} className="text-blue-600" />
                  <div>
                    <p className="text-xs text-blue-700 font-semibold">দ্রুত ডেলিভারি</p>
                    <p className="text-sm font-black text-blue-900">5-30 Minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <Sparkles size={24} className="text-purple-600" />
                  <div>
                    <p className="text-xs text-purple-700 font-semibold">২৪/৭ সাপোর্ট</p>
                    <p className="text-sm font-black text-purple-900">Always Available</p>
                  </div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-600">
                <p className="font-semibold mb-2">Thank you for your purchase! / ক্রয়ের জন্য ধন্যবাদ!</p>
                <p className="text-xs">Support: +8801883800356 | Email: support@nrxstore.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
