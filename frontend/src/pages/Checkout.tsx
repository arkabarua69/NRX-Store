import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, Lock, CheckCircle, ShieldCheck, Info, ChevronRight, Copy, Package,
  Upload, FileText, Download, Clock, User, CreditCard, Smartphone, AlertCircle, X, Check
} from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { createOrder, uploadPaymentProof } from "@/lib/orderService";
import { Product } from "@/lib/types";
import { toast } from "sonner";
import Footer from "@/components/ui/Footer";
import { CartItem } from "@/components/CartSidebar";
import { getSettings, SiteSettings } from "@/lib/settingsService";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userData } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"payment" | "proof" | "success">("payment");
  const [orderId, setOrderId] = useState("");
  const [orderPaymentInfo, setOrderPaymentInfo] = useState<{ method: string; transactionId: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string>("");
  const [uploadingProof, setUploadingProof] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const cartItems: CartItem[] = location.state?.cartItems || [];
  const singleProduct: Product | null = location.state?.product || null;

  const isCartCheckout = cartItems.length > 0;
  const totalDiamonds = isCartCheckout 
    ? cartItems.reduce((sum, item) => sum + (item.product.diamonds * item.quantity), 0)
    : singleProduct?.diamonds || 0;
  const subtotal = isCartCheckout
    ? cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    : singleProduct?.price || 0;
  const serviceFee = 0;
  const totalPrice = subtotal + serviceFee;

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      const data = await getSettings();
      console.log("=== CHECKOUT: Settings Loaded ===");
      console.log("Payment Methods:", data.paymentMethods);
      setSettings(data);
    };
    loadSettings();
  }, []);

  // Get payment details from settings
  const paymentDetails = settings?.paymentMethods || {
    bkash: { number: "+8801883800356", type: "Send Money", 
      logo: "https://freelogopng.com/images/all_img/1656234745bkash-app-logo-png.png", enabled: true },
    nagad: { number: "+8801883800356", type: "Send Money",
      logo: "https://freelogopng.com/images/all_img/1679248787Nagad-Logo.png", enabled: true },
    rocket: { number: "+8801580831611", type: "Send Money",
      logo: "https://static.vecteezy.com/system/resources/thumbnails/068/706/013/small/rocket-color-logo-mobile-banking-icon-free-png.png", 
      enabled: true }
  };

  // Get enabled payment methods
  const enabledPaymentMethods = Object.entries(paymentDetails)
    .filter(([_, details]) => details.enabled)
    .map(([key]) => key as "bkash" | "nagad" | "rocket");

  // Set default payment method to first enabled one
  useEffect(() => {
    if (enabledPaymentMethods.length > 0 && !enabledPaymentMethods.includes(paymentMethod)) {
      setPaymentMethod(enabledPaymentMethods[0]);
    }
  }, [enabledPaymentMethods, paymentMethod]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const [formData, setFormData] = useState({ gameId: "", phoneNumber: "", transactionId: "" });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("নম্বর কপি হয়েছে!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("ফাইল সাইজ ৫MB এর কম হতে হবে!");
        return;
      }
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProcessOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.gameId || !formData.transactionId) {
      toast.error("সবগুলো তথ্য পূরণ করুন!");
      return;
    }

    if (formData.gameId.trim().length < 3) {
      toast.error("সঠিক Player ID দিন (কমপক্ষে ৩ অক্ষর)");
      return;
    }

    if (formData.transactionId.trim().length < 5) {
      toast.error("সঠিক Transaction ID দিন (কমপক্ষে ৫ অক্ষর)");
      return;
    }

    if (!user || !userData) {
      toast.error("আগে লগইন করুন");
      navigate("/login");
      return;
    }

    if (!isCartCheckout && !singleProduct) {
      toast.error("কোনো প্রোডাক্ট সিলেক্ট করা নেই");
      navigate("/store");
      return;
    }

    setLoading(true);
    try {
      if (isCartCheckout) {
        // Create orders for all cart items
        const orderPromises = cartItems.map(item => 
          createOrder(user.id, userData.email, userData.name,
            { 
              productId: item.product.id, 
              gameId: formData.gameId.trim(), 
              phoneNumber: formData.phoneNumber.trim(),
              paymentMethod, 
              transactionId: formData.transactionId.trim() 
            },
            { 
              name: item.product.name, 
              diamonds: item.product.diamonds * item.quantity, 
              price: item.product.price * item.quantity 
            }
          )
        );
        
        const orderIds = await Promise.all(orderPromises);
        
        if (!orderIds || orderIds.length === 0) {
          throw new Error("অর্ডার ID পাওয়া যায়নি");
        }
        
        setOrderId(orderIds[0]);
        setOrderPaymentInfo({
          method: paymentMethod,
          transactionId: formData.transactionId.trim()
        });
        localStorage.removeItem('cart');
        toast.success(`${cartItems.length}টি অর্ডার তৈরি হয়েছে!`);
        
        // Add notification
        addNotification({
          title: "অর্ডার সফল!",
          message: `${cartItems.length}টি পণ্যের অর্ডার সফলভাবে তৈরি হয়েছে। মোট: ৳${totalPrice}`,
          type: "order",
          orderId: orderIds[0],
          link: "/dashboard"
        });
      } else if (singleProduct) {
        // Create single order
        const newOrderId = await createOrder(
          user.id, 
          userData.email, 
          userData.name,
          { 
            productId: singleProduct.id, 
            gameId: formData.gameId.trim(), 
            phoneNumber: formData.phoneNumber.trim(),
            paymentMethod, 
            transactionId: formData.transactionId.trim() 
          },
          { 
            name: singleProduct.name, 
            diamonds: singleProduct.diamonds, 
            price: singleProduct.price 
          }
        );
        
        if (!newOrderId) {
          throw new Error("অর্ডার ID পাওয়া যায়নি");
        }
        
        setOrderId(newOrderId);
        setOrderPaymentInfo({
          method: paymentMethod,
          transactionId: formData.transactionId.trim()
        });
        toast.success("অর্ডার তৈরি হয়েছে!");
        
        // Add notification
        addNotification({
          title: "নতুন অর্ডার!",
          message: `${singleProduct.name} - ${singleProduct.diamonds} ডায়মন্ড। মোট: ৳${singleProduct.price}`,
          type: "order",
          orderId: newOrderId,
          link: "/dashboard"
        });
      }
      
      setStep("proof");
      toast.success("এখন পেমেন্ট প্রুফ আপলোড করুন", { duration: 3000 });
    } catch (error: any) {
      console.error("Order creation error:", error);
      
      // Show specific error message
      const errorMessage = error.message || "অর্ডার তৈরি করতে সমস্যা হয়েছে";
      toast.error(errorMessage, { duration: 5000 });
      
      // Log detailed error for debugging
      console.error("Detailed error:", {
        message: error.message,
        stack: error.stack,
        userData: { id: user?.id, email: userData?.email },
        formData: formData,
        product: singleProduct?.id || "cart"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProof = async () => {
    if (!paymentProof) {
      toast.error("পেমেন্ট প্রুফ সিলেক্ট করুন!");
      return;
    }

    if (!orderPaymentInfo) {
      toast.error("পেমেন্ট তথ্য পাওয়া যায়নি!");
      return;
    }

    console.log("Uploading proof for order:", orderId);
    console.log("File:", paymentProof.name, paymentProof.size, paymentProof.type);

    setUploadingProof(true);
    try {
      const url = await uploadPaymentProof(
        orderId, 
        paymentProof,
        orderPaymentInfo.method,
        orderPaymentInfo.transactionId
      );
      console.log("Upload successful, URL:", url);
      toast.success("পেমেন্ট প্রুফ আপলোড সফল!");
      setStep("success");
      
      // Add notification for proof upload
      addNotification({
        title: "পেমেন্ট প্রুফ আপলোড সফল!",
        message: "আপনার পেমেন্ট প্রুফ সফলভাবে আপলোড হয়েছে। শীঘ্রই ভেরিফাই করা হবে।",
        type: "success",
        orderId: orderId,
        link: "/dashboard"
      });
    } catch (error: any) {
      console.error("Proof upload error:", error);
      toast.error(error.message || "পেমেন্ট প্রুফ আপলোড ব্যর্থ!");
    } finally {
      setUploadingProof(false);
    }
  };

  const downloadInvoice = () => {
    const invoiceText = `
═══════════════════════════════════
        NRX DIAMOND STORE
        Invoice / রসিদ
═══════════════════════════════════
Order ID: ${orderId}
Date: ${new Date().toLocaleDateString('bn-BD')}
Customer: ${userData?.name}
Game ID: ${formData.gameId}
───────────────────────────────────
PAYMENT DETAILS
───────────────────────────────────
Method: ${paymentMethod.toUpperCase()}
Transaction ID: ${formData.transactionId}
───────────────────────────────────
ORDER DETAILS
───────────────────────────────────
Total Diamonds: ${totalDiamonds} 💎
Total Amount: ৳${totalPrice}
═══════════════════════════════════
Thank you for your purchase!
ক্রয়ের জন্য ধন্যবাদ!
═══════════════════════════════════`;
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded!");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />
      <main className="max-w-5xl mx-auto px-4 pt-24 pb-20">
        {step === "payment" ? (
          <div className="grid lg:grid-cols-12 gap-8">
            <section className="lg:col-span-7 space-y-6">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold">
                <ArrowLeft size={18} /> ফিরে যান
              </button>
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white rounded-t-2xl">
                  <h1 className="text-2xl font-black flex items-center gap-2">
                    <ShieldCheck size={24} /> নিরাপদ পেমেন্ট
                  </h1>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2">
                      ১. Player ID দিন
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. 123456789"
                      minLength={3}
                      value={formData.gameId}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-red-500 focus:outline-none"
                      onChange={(e) => setFormData({ ...formData, gameId: e.target.value })} 
                    />
                    <p className="text-xs text-gray-500 mt-1">কমপক্ষে ৩ অক্ষর প্রয়োজন</p>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3">
                      ২. পেমেন্ট মাধ্যম সিলেক্ট করুন
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {enabledPaymentMethods.map((m) => (
                        <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                          className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === m ? 
                            'border-red-500 bg-red-50 scale-105' : 'border-gray-200 hover:border-gray-300'}`}>
                          <img src={paymentDetails[m].logo} alt={m} className="w-12 h-12 object-contain mx-auto mb-2" />
                          <span className="text-xs font-black uppercase">{m}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-xl p-2 shadow-md">
                          <img src={paymentDetails[paymentMethod].logo} alt={paymentMethod} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-red-600 uppercase">{paymentMethod} Send Money</p>
                          <p className="text-2xl font-black text-gray-900">{paymentDetails[paymentMethod].number}</p>
                        </div>
                      </div>
                      <button onClick={() => handleCopy(paymentDetails[paymentMethod].number)}
                        className="p-2 bg-white shadow-md rounded-lg hover:bg-gray-50">
                        <Copy size={18} className="text-gray-600" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-700 space-y-2 pt-3 border-t-2 border-gray-200 font-semibold">
                      <p>১. উপরের নম্বরে ৳{totalPrice} <b>Send Money</b> করুন</p>
                      <p>২. টাকা পাঠানোর পর <b>Transaction ID</b> দিন</p>
                    </div>
                  </div>
                  <form onSubmit={handleProcessOrder} className="space-y-4">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                      <div className="flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-bold mb-1">অর্ডার করার আগে নিশ্চিত করুন:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Player ID সঠিক এবং কমপক্ষে ৩ অক্ষর</li>
                            <li>পেমেন্ট সম্পন্ন হয়েছে</li>
                            <li>Transaction ID সঠিক এবং কমপক্ষে ৫ অক্ষর</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">Transaction ID</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Ex: 8N77XCW9"
                        minLength={5}
                        value={formData.transactionId}
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 font-mono font-bold focus:ring-2 focus:ring-red-500"
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })} 
                      />
                      <p className="text-xs text-gray-500 mt-1">কমপক্ষে ৫ অক্ষর প্রয়োজন</p>
                    </div>
                    <button disabled={loading} type="submit"
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-4 rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2">
                      {loading ? "প্রসেস হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
                      {!loading && <ChevronRight size={20} />}
                    </button>
                  </form>
                </div>
              </div>
            </section>

            <aside className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-200 sticky top-24">
                <h3 className="text-sm font-black text-gray-500 uppercase mb-4">অর্ডার সামারি</h3>
                {isCartCheckout ? (
                  <div className="space-y-3 pb-4 border-b-2 border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-gray-900">{cartItems.length} Items</h2>
                        <p className="text-sm text-gray-500">Multiple Products</p>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 truncate">{item.product.name}</p>
                            <p className="text-xs text-gray-500">{item.product.diamonds} 💎 × {item.quantity}</p>
                          </div>
                          <p className="font-black text-gray-900">৳{item.product.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : singleProduct ? (
                  <div className="flex items-center gap-4 pb-4 border-b-2 border-gray-100">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl">💎</div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900">{singleProduct.diamonds} Diamonds</h2>
                      <p className="text-sm text-gray-500">Free Fire Top-up</p>
                    </div>
                  </div>
                ) : null}
                <div className="py-4 space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="text-green-600">৳{serviceFee} (Free)</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-600">Total Diamonds</span>
                    <span className="text-gray-900">{totalDiamonds} 💎</span>
                  </div>
                  <div className="pt-3 border-t-2 border-gray-100 flex justify-between items-center">
                    <span className="font-black text-gray-900">Total</span>
                    <span className="text-3xl font-black text-red-600">৳{totalPrice}</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <Lock size={14} className="text-green-500" /> Secure SSL
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <Clock size={14} className="text-blue-500" /> Delivery: 5-30 Mins
                  </div>
                </div>
              </div>
            </aside>
          </div>

        ) : step === "proof" ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">পেমেন্ট প্রুফ আপলোড করুন</h2>
                <p className="text-gray-600">আপনার পেমেন্টের স্ক্রিনশট আপলোড করুন</p>
              </div>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 transition-all">
                  {proofPreview ? (
                    <div className="relative">
                      <img src={proofPreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                      <button onClick={() => { setPaymentProof(null); setProofPreview(""); }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-700 mb-1">ক্লিক করে ফাইল সিলেক্ট করুন</p>
                      <p className="text-xs text-gray-500">PNG, JPG (Max 5MB)</p>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-bold mb-1">গুরুত্বপূর্ণ:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Transaction ID স্পষ্ট দেখা যাচ্ছে কিনা নিশ্চিত করুন</li>
                        <li>পেমেন্ট সফল হওয়ার স্ক্রিনশট দিন</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep("payment")}
                    className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50">
                    পিছনে যান
                  </button>
                  <button onClick={() => setStep("success")}
                    className="px-4 py-3 rounded-xl border-2 border-blue-500 text-blue-600 font-bold hover:bg-blue-50">
                    Skip
                  </button>
                  <button onClick={handleUploadProof} disabled={!paymentProof || uploadingProof}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-black hover:from-red-600 hover:to-pink-600 disabled:opacity-50 flex items-center justify-center gap-2">
                    {uploadingProof ? "আপলোড হচ্ছে..." : "আপলোড করুন"}
                    {!uploadingProof && <Check size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-xl border-2 border-gray-200 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">অর্ডার সফল!</h2>
              <p className="text-xl text-gray-600 mb-8">আপনার পেমেন্ট সফলভাবে প্রক্রিয়া করা হয়েছে</p>
              <div className="bg-red-50 rounded-2xl p-6 mb-8 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">অর্ডার নম্বর</p>
                  <p className="text-2xl font-black text-red-600">{orderId}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-red-100">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">মোট ডায়মন্ড</p>
                    <p className="text-lg font-black text-gray-900">{totalDiamonds} 💎</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">মোট মূল্য</p>
                    <p className="text-lg font-black text-gray-900">৳{totalPrice}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-8 text-left">
                {["ডায়মন্ড ৩০ মিনিটের মধ্যে পৌঁছাবে", "আপনার প্রোফাইলে রসিদ যোগ করা হয়েছে", "২৪/৭ গ্রাহক সাপোর্ট উপলব্ধ"].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-semibold">{text}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate(`/invoice/${orderId}`)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-black hover:from-purple-600 hover:to-blue-600 flex items-center justify-center gap-2">
                  <FileText size={18} />
                  Invoice দেখুন
                </button>
                <button onClick={downloadInvoice}
                  className="flex-1 py-3 rounded-xl border-2 border-red-600 text-red-600 font-black hover:bg-red-50 flex items-center justify-center gap-2">
                  <Download size={18} />
                  Invoice ডাউনলোড
                </button>
                <button onClick={() => navigate("/dashboard")}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-black hover:from-red-600 hover:to-pink-600">
                  ড্যাশবোর্ড দেখুন
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
