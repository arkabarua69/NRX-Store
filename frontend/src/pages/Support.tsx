import { useState } from "react";
import { 
  MessageCircle, Phone, Mail, Send, Sparkles, Flame, Star,
  User, AtSign, Smartphone, FileText, AlertCircle, CheckCircle,
  Clock, Headphones, Shield, Zap, ArrowRight, Package, CreditCard
} from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";
import { toast } from "sonner";
import { API_URL } from "@/lib/config";

const categories = [
  { id: "general", name: "সাধারণ প্রশ্ন", nameBn: "General Question", icon: MessageCircle, color: "from-blue-500 to-cyan-500" },
  { id: "order", name: "অর্ডার সমস্যা", nameBn: "Order Issue", icon: Package, color: "from-purple-500 to-pink-500" },
  { id: "payment", name: "পেমেন্ট সমস্যা", nameBn: "Payment Issue", icon: CreditCard, color: "from-green-500 to-emerald-500" },
  { id: "technical", name: "টেকনিক্যাল সমস্যা", nameBn: "Technical Issue", icon: Shield, color: "from-red-500 to-orange-500" },
  { id: "other", name: "অন্যান্য", nameBn: "Other", icon: Sparkles, color: "from-yellow-500 to-orange-500" },
];

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "general"
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("সব ফিল্ড পূরণ করুন! Please fill all required fields");
      return;
    }

    setSubmitting(true);

    try {
      console.log("Submitting to:", `${API_URL}/support`);
      console.log("Form data:", formData);
      
      const response = await fetch(`${API_URL}/support`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        toast.success("টিকেট সফলভাবে জমা হয়েছে! Ticket submitted successfully!");
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          category: "general"
        });
      } else {
        toast.error(data.error || "টিকেট জমা দিতে ব্যর্থ! Failed to submit ticket");
      }
    } catch (error: any) {
      console.error("Error submitting ticket:", error);
      toast.error(`সার্ভারের সাথে সংযোগ করতে ব্যর্থ! ${error.message || "Failed to connect to server"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 lg:w-96 h-64 lg:h-96 bg-white/10 rounded-full blur-3xl -ml-32 lg:-ml-48 -mt-32 lg:-mt-48 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-80 lg:w-[500px] h-80 lg:h-[500px] bg-white/10 rounded-full blur-3xl -mr-40 lg:-mr-64 -mb-40 lg:-mb-64 animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="hidden lg:block absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
            <Headphones size={32} className="text-white/30" />
          </div>
          <div className="hidden lg:block absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
            <MessageCircle size={28} className="text-yellow-300/40" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-12 lg:pt-32 pb-16 lg:pb-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-black text-xs lg:text-sm mb-4 lg:mb-8 shadow-2xl border-2 border-white/30 animate-pulse">
              <Flame size={16} className="animate-bounce" />
              <span>২৪/৭ সাপোর্ট সেবা</span>
              <Star size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-4 lg:mb-6 leading-tight drop-shadow-2xl">
              সাপোর্ট <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100">টিকেট</span>
            </h1>
            
            <p className="text-sm md:text-xl lg:text-2xl text-white/90 mb-6 lg:mb-10 max-w-3xl mx-auto font-bold drop-shadow-lg">
              আমরা সবসময় আপনার সাহায্যের জন্য প্রস্তুত
            </p>

            <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center justify-center gap-2 lg:gap-4">
              <div className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl">
                <div className="p-1 bg-green-500 rounded-full pointer-events-none">
                  <Clock size={14} className="text-white pointer-events-none" />
                </div>
                <span className="text-gray-900 font-black text-xs lg:text-sm pointer-events-none">২৪/৭ উপলব্ধ</span>
              </div>
              <div className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 lg:px-5 py-2 lg:py-3 rounded-full border-2 border-white shadow-xl">
                <div className="p-1 bg-blue-500 rounded-full pointer-events-none">
                  <Zap size={14} className="text-white pointer-events-none" />
                </div>
                <span className="text-gray-900 font-black text-xs lg:text-sm pointer-events-none">দ্রুত সাড়া</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Contact */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl">
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Phone size={20} className="text-green-500" />
                দ্রুত যোগাযোগ
              </h3>
              <div className="space-y-4">
                <a 
                  href="https://wa.me/8801883800356"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-semibold">WhatsApp</p>
                    <p className="font-bold text-gray-900">+880 1883-800356</p>
                  </div>
                  <ArrowRight size={18} className="text-green-500 group-hover:translate-x-1 transition-transform" />
                </a>

                <a 
                  href="mailto:support@nrxstore.com"
                  className="group flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-semibold">Email</p>
                    <p className="font-bold text-gray-900 text-sm">support@nrxstore.com</p>
                  </div>
                  <ArrowRight size={18} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Clock size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black">সাড়া সময়</h3>
                  <p className="text-white/80 text-sm">Response Time</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/90">সাধারণ প্রশ্ন</span>
                  <span className="font-black">১-২ ঘন্টা</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">জরুরি সমস্যা</span>
                  <span className="font-black">১৫-৩০ মিনিট</span>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <a
              href="/faq"
              className="block bg-white rounded-2xl p-6 border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all">
                  <AlertCircle size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">FAQ দেখুন</h3>
                  <p className="text-sm text-gray-600">সাধারণ প্রশ্নের উত্তর</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-yellow-600 font-bold text-sm">
                <span>FAQ পেজে যান</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>

          {/* Support Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-2xl p-8 md:p-12 border-2 border-green-200 shadow-xl text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">টিকেট জমা হয়েছে!</h2>
                <p className="text-gray-600 mb-6 text-lg">
                  আপনার সাপোর্ট টিকেট সফলভাবে জমা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-black text-lg hover:shadow-lg hover:scale-105 transition-all"
                >
                  <MessageCircle size={20} />
                  নতুন টিকেট জমা দিন
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 md:p-12 border-2 border-gray-200 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <MessageCircle size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">সাপোর্ট টিকেট</h2>
                    <p className="text-sm text-gray-600">আপনার সমস্যা বর্ণনা করুন</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      সমস্যার ধরন - Category
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: cat.id })}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl font-bold text-sm transition-all ${
                              formData.category === cat.id
                                ? `bg-gradient-to-br ${cat.color} text-white shadow-lg scale-105`
                                : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            <IconComponent size={20} />
                            <span className="text-xs text-center">{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      নাম - Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="আপনার নাম লিখুন"
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        ইমেইল - Email *
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        ফোন - Phone
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="+880 1XXX-XXXXXX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      বিষয় - Subject *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="সমস্যার সংক্ষিপ্ত বিবরণ"
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      বার্তা - Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                      placeholder="আপনার সমস্যা বিস্তারিত লিখুন..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-lg hover:shadow-lg hover:shadow-green-200 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        জমা হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        টিকেট জমা দিন - Submit Ticket
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
