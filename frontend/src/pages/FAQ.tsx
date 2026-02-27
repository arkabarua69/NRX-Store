import { useState, useEffect } from "react";
import { 
  ChevronDown, HelpCircle, Search, Filter, Sparkles, 
  MessageCircle, Phone, ArrowRight, Flame, Star,
  CreditCard, Truck, Shield, User
} from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";
import { getAllFAQs, FAQ as FAQType } from "@/lib/faqService";
import { toast } from "sonner";

const categories = [
  { id: "all", name: "সব প্রশ্ন", nameBn: "All Questions", icon: HelpCircle, color: "from-red-500 to-pink-500" },
  { id: "general", name: "সাধারণ", nameBn: "General", icon: Sparkles, color: "from-blue-500 to-cyan-500" },
  { id: "payment", name: "পেমেন্ট", nameBn: "Payment", icon: CreditCard, color: "from-green-500 to-emerald-500" },
  { id: "delivery", name: "ডেলিভারি", nameBn: "Delivery", icon: Truck, color: "from-purple-500 to-pink-500" },
  { id: "account", name: "অ্যাকাউন্ট", nameBn: "Account", icon: User, color: "from-yellow-500 to-orange-500" },
  { id: "technical", name: "টেকনিক্যাল", nameBn: "Technical", icon: Shield, color: "from-indigo-500 to-purple-500" },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      console.log("🔍 Loading FAQs from API...");
      const data = await getAllFAQs();
      console.log("✅ FAQs loaded:", data.length, "items");
      setFaqs(data);
    } catch (error) {
      console.error("❌ Error loading FAQs:", error);
      toast.error("FAQ লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = faqs
    .filter(faq => selectedCategory === "all" || faq.category === selectedCategory)
    .filter(faq => 
      searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.questionBn.includes(searchQuery) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answerBn.includes(searchQuery)
    )
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-600">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 lg:w-96 h-64 lg:h-96 bg-white/10 rounded-full blur-3xl -ml-32 lg:-ml-48 -mt-32 lg:-mt-48 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-80 lg:w-[500px] h-80 lg:h-[500px] bg-white/10 rounded-full blur-3xl -mr-40 lg:-mr-64 -mb-40 lg:-mb-64 animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="hidden lg:block absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
            <HelpCircle size={32} className="text-white/30" />
          </div>
          <div className="hidden lg:block absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
            <MessageCircle size={28} className="text-yellow-300/40" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-12 lg:pt-32 pb-16 lg:pb-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-black text-xs lg:text-sm mb-4 lg:mb-8 shadow-2xl border-2 border-white/30 animate-pulse">
              <Flame size={16} className="animate-bounce" />
              <span>সাহায্য কেন্দ্র</span>
              <Star size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-4 lg:mb-6 leading-tight drop-shadow-2xl">
              FAQ - <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100">সাহায্য</span>
            </h1>
            
            <p className="text-sm md:text-xl lg:text-2xl text-white/90 mb-6 lg:mb-10 max-w-3xl mx-auto font-bold drop-shadow-lg">
              আপনার সব প্রশ্নের উত্তর এখানে
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Search & Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 shadow-xl">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={22} />
                <input 
                  type="text" 
                  placeholder="প্রশ্ন খুঁজুন... (Search questions)" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-500 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Filter size={18} className="text-white" />
            </div>
            <h3 className="text-lg font-black text-gray-900">ক্যাটাগরি সিলেক্ট করুন</h3>
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide flex-wrap">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button 
                  key={cat.id} 
                  onClick={() => setSelectedCategory(cat.id)} 
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat.id 
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105` 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 hover:scale-105 hover:shadow-md"
                  }`}
                >
                  <IconComponent size={14} className={`transition-transform duration-300 ${selectedCategory === cat.id ? "" : "group-hover:rotate-12 group-hover:scale-110"}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ List - 2 Column Grid */}
        {loading ? (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl shadow-xl border-2 border-gray-200">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-900 mb-2">FAQ লোড হচ্ছে...</h3>
            <p className="text-gray-600">অনুগ্রহ করে অপেক্ষা করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFAQs.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-3xl shadow-xl border-2 border-gray-200">
                <HelpCircle size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-900 mb-2">কোন প্রশ্ন পাওয়া যায়নি</h3>
                <p className="text-gray-600">অন্য ক্যাটাগরি বা সার্চ টার্ম চেষ্টা করুন</p>
              </div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 pr-4">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categories.find(c => c.id === faq.category)?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center flex-shrink-0 mt-1`}>
                        <span className="text-white font-black text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-black text-gray-900 mb-1">{faq.question}</p>
                        <p className="text-sm text-gray-600">{faq.questionBn}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? "rotate-180 text-blue-500" : ""
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-5 pb-5 pt-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-t-2 border-blue-200">
                      <div className="pl-11">
                        <p className="text-gray-700 leading-relaxed mb-2">{faq.answer}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.answerBn}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Contact Support CTA */}
        <div className="mt-12 relative bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mt-16 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mb-20 animate-pulse delay-75" />
          </div>
          
          <div className="relative z-10 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-black mb-4">আরও প্রশ্ন আছে?</h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              আমাদের সাপোর্ট টিম ২৪/৭ আপনার সাহায্যের জন্য প্রস্তুত
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/support"
                className="group flex items-center gap-2 bg-white text-red-500 hover:bg-gray-100 px-8 py-4 rounded-full font-black text-lg shadow-xl transition-all transform hover:scale-105"
              >
                <MessageCircle size={20} />
                <span>সাপোর্ট টিকেট</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://wa.me/8801883800356"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-white/30 transition-all"
              >
                <Phone size={20} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
