import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface OpenAIResponse {
  choices: { message: { content: string } }[];
}

// Professional responses for NRX Store
const professionalResponses: Record<string, string> = {
  "hi": "👋 স্বাগতম! NRX Store এ আপনাকে অসংখ্য ধন্যবাদ। আমি আপনার পার্সোনাল অ্যাসিস্ট্যান্ট। কিভাবে আপনাকে সাহায্য করতে পারি?",
  "hello": "👋 নমস্কার! আপনাকে NRX Store এ দেখে খুব ভালো লাগলো। আপনার কোনো প্রশ্ন আছে?",
  "damond": "💎 আমাদের ফ্রি ফায়ার ডায়মন্ড প্যাকেজগুলো সম্পর্কে আপনি যা জানতে চান:\n• দ্রুত ডেলিভারি (৫-৩০ মিনিট)\n• সব ধরনের প্যাকেজ উপলব্ধ\n• নিরাপদ পেমেন্ট গেটওয়ে\nআপনার প্রয়োজনীয় প্যাকেজ সম্পর্কে জানান!",
  "kokon": "📦 আমাদের ডেলিভারি সিস্টেম খুবই দ্রুত:\n• অর্ডার কনফার্মেশনের পর ৫ থেকে ৩০ মিনিটের মধ্যে ডায়মন্ড পৌঁছে যায়\n• গেমের অ্যাকাউন্টে স্বয়ংক্রিয়ভাবে ডেলিভারি\n• ডেলিভারি সময় কোনো অতিরিক্ত চার্জ নেই",
  "delivery": "🚚 ডেলিভারি টাইম:\n• সাধারণত ৫ থেকে ৩০ মিনিটের মধ্যে\n• গেম সার্ভারের উপর ভিত্তি করে\n• অর্ডার কনফার্মেশনের পর তাৎক্ষণিক ডেলিভারি",
  "payment": "💳 আমাদের পেমেন্ট মেথডগুলো:\n• bKash - সবচেয়ে জনপ্রিয়\n• Nagad - দ্রুত ট্রানজেকশন\n• Rocket - মোবাইল ব্যালেন্স\nকোনো পেমেন্ট সমস্যা হলে আমাদের সাপোর্টে যোগাযোগ করুন!",
  "contact": "📞 আমাদের সাপোর্ট কন্টাক্ট:\n• মোবাইল: 01883800356\n• WhatsApp: 01883800356\n• সাপোর্ট সার্ভিস: ২৪/৭\n• রেসপন্স টাইম: ১-২ মিনিট",
  "support": "🛡️ আমাদের সাপোর্ট সার্ভিস:\n• ২৪ ঘণ্টা সাপোর্ট\n• দ্রুত রেসপন্স\n• প্রফেশনাল টিম\n• সমস্যা সমাধানে দক্ষ\nআপনার যেকোনো সমস্যা আমরা দ্রুত সমাধান করবো!",
  "order": "📦 অর্ডার স্ট্যাটাস:\n• অর্ডার কনফার্ম হওয়ার পর ট্র্যাকিং নম্বর দেওয়া হয়\n• ডেলিভারির আগে নোটিফিকেশন পাবেন\n• কোনো সমস্যা হলে সাপোর্টে যোগাযোগ করুন",
  "status": "📊 অর্ডার স্ট্যাটাস চেক করতে:\n• আপনার অর্ডার আইডি দিয়ে ট্র্যাক করুন\n• সাপোর্ট টিম থেকে আপডেট পাবেন\n• ডেলিভারির সময় সম্পূর্ণ ইনফরমেশন পাবেন",
  "price": "💰 আমাদের প্যাকেজ প্রাইস:\n• বিভিন্ন ডায়মন্ড প্যাকেজ উপলব্ধ\n• সস্তা দামে বড় প্যাকেজ\n• অফার এবং ডিসকাউন্ট নিয়মিত\n• সেরা মূল্য-মান অনুপাত",
  "game": "🎮 আমাদের সার্ভিস:\n• শুধুমাত্র ফ্রি ফায়ার ডায়মন্ড\n• নিরাপদ এবং বিশ্বস্ত\n• গ্যারান্টিযুক্ত ডেলিভারি\n• গ্রাহক সন্তুষ্টি আমাদের প্রাথমিক লক্ষ্য",
  "help": "❓ আমাকে কিভাবে সাহায্য করতে পারি?\n• ডায়মন্ড প্যাকেজ সম্পর্কে তথ্য\n• অর্ডার স্ট্যাটাস\n• পেমেন্ট সমস্যা সমাধান\n• অন্যান্য প্রশ্ন\nআপনার প্রশ্ন জানান, আমি সাহায্য করবো!",
  "thank": "🙏 আপনাকে ধন্যবাদ! আমাদের সাথে কাজ করার জন্য আমরা গর্বিত। আপনার সাফল্য আমাদের সাফল্য।",
  "welcome": "😊 আপনাকে স্বাগতম! NRX Store এ আপনাকে দেখে খুব ভালো লাগলো। আমরা আপনার সাথে থাকবো প্রতিটি ধাপে।",
  "good morning": "☀️ সুপ্রভাত! আপনার দিনটি শুভ হোক। আমি আপনার সাথে দিনের শুরু থেকেই সাহায্য করতে প্রস্তুত!",
  "good afternoon": "🌤️ শুভ অপরাহ্ন! আপনার দিনটি কেমন চলছে? আমি আপনার সাথে আছি!",
  "good evening": "🌙 শুভ সন্ধ্যা! দিনের শেষে আপনার কোনো প্রয়োজন থাকলে আমি এখানে!",
  "good night": "🌙 শুভ রাত্রি! ভালো ঘুমান এবং আবার দেখা হবে কালকে!",
  "bye": "👋 আল্লাহ হাফেজ! আপনার দিনটি শুভ হোক। আবার দেখা হবে!",
  "see you": "👋 দেখা হবে! আপনার সাফল্য কামনা করছি।",
  "ok": "✅ ঠিক আছে! আপনার কোনো প্রয়োজন হলে জানান।",
  "yes": "✅ হ্যাঁ! আমি আপনার সাথে আছি।",
  "no": "❌ না! আপনার কোনো প্রয়োজন থাকলে জানান।",
  "sorry": "🙏 কোনো দোষ নেই! আমি আপনার সাথে আছি।",
  "thanks": "🙏 আপনাকে ধন্যবাদ! আমাদের সাথে কাজ করার জন্য আমরা গর্বিত।",
  "nrx": "💎 NRX Store - আপনার পছন্দের ফ্রি ফায়ার ডায়মন্ড স্টোর। দ্রুত, নিরাপদ এবং বিশ্বস্ত!",
  "store": "🏪 NRX Store - আপনার পছন্দের ফ্রি ফায়���র ডায়মন্ড স্টোর। দ্রুত, নিরাপদ এবং বিশ্বস্ত!",
  "free fire": "🎮 ফ্রি ফায়ার ডায়মন্ড স্টোর - NRX Store। দ্রুত ডেলিভারি, নিরাপদ পেমেন্ট এবং বিশ্বস্ত সাপোর্ট!",
  "diamond": "💎 আমাদের ফ্রি ফায়ার ডায়মন্ড প্যাকেজগুলো সম্পর্কে আপনি যা জানতে চান:\n• দ্রুত ডেলিভারি (৫-৩০ মিনিট)\n• সব ধরনের প্যাকেজ উপলব্ধ\n• নিরাপদ পেমেন্ট গেটওয়ে\nআপনার প্রয়োজনীয় প্যাকেজ সম্পর্কে জানান!",
  "bKash": "💳 bKash - বাংলাদেশের সবচেয়ে জনপ্রিয় মোবাইল ব্যাংকিং। আমাদের সাথে bKash দিয়ে পেমেন্ট করতে সুবিধা হয়।",
  "nagad": "💳 Nagad - দ্রুত এবং নিরাপদ মোবাইল ব্যাংকিং। আমাদের সাথে Nagad দিয়ে পেমেন্ট করতে সুবিধা হয়।",
  "rocket": "💳 Rocket - মোবাইল ব্যালেন্স দিয়ে পেমেন্ট। আমাদের সাথে Rocket দিয়ে পেমেন্ট করতে সুবিধা হয়।",

  "01883800356": "📞 আমাদের সাপোর্ট কন্টাক্ট:\n• মোবাইল: 01883800356\n• WhatsApp: 01883800356\n• সাপোর্ট সার্ভিস: ২৪/৭\n• রেসপন্স টাইম: ১-২ মিনিট",
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 স্বাগতম! NRX Store এ আপনাকে অসংখ্য ধন্যবাদ। আমি আপনার পার্সোনাল অ্যাসিস্ট্যান্ট। কিভাবে আপনাকে সাহায্য করতে পারি?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Call backend chatbot API with RL brain
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE}/api/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText,
          context: {
            previousMessages: messages.slice(-5).map(m => m.text),
            userSentiment: 'neutral',
            topicHistory: [],
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      console.log("✅ Chatbot response:", data);
      
      // Backend returns: { success: true, data: { response: "...", intent: "..." } }
      const botResponse = data.data?.response || data.response || "দুঃখিত, আমি বুঝতে পারিনি।";
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "🤖 আমি একটি সমস্যার সম্মুখীন হয়েছি। আমাদের প্রফেশনাল সাপোর্ট টিমের সাথে যোগাযোগ করুন:\n📞 01883800356 (WhatsApp)\n⏰ ২৪/৭ সাপোর্ট",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] bg-white rounded-3xl shadow-2xl border-4 border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header - Modern Gradient */}
          <div className="relative bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 p-5 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30">
                    <Bot size={24} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-black text-lg">🤖 NRX AI Support</h3>
                  <p className="text-xs text-white/90 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online • ২৪/৭ সাপোর্ট
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-white/20 rounded-xl transition-all hover:scale-110 active:scale-95"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Messages - Modern Design */}
          <div className="h-[400px] sm:h-[450px] overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white rounded-br-md border-2 border-white/20"
                      : "bg-white border-2 border-gray-200 text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm font-medium whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <p
                    className={`text-[10px] mt-2 font-bold ${
                      msg.sender === "user" ? "text-white/80" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white border-2 border-gray-200 rounded-2xl rounded-bl-md px-5 py-4 shadow-lg">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-bounce delay-75" />
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-red-500 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Modern Design */}
          <div className="p-4 sm:p-5 bg-white border-t-4 border-gray-100">
            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="আপনার প্রশ্ন লিখুন... 💬"
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 focus:outline-none font-medium text-sm transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="px-4 sm:px-5 py-3 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 font-bold"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center font-bold">
              ⚡ দ্রুত রেসপন্স • 🔒 নিরাপদ চ্যাট
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button - Modern Floating Design */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isOpen 
            ? "bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800" 
            : "bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 hover:shadow-red-500/50 hover:scale-110 animate-pulse"
        }`}
      >
        {/* Glow Effect */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
        )}
        
        {/* Icon */}
        <div className="relative text-white">
          {isOpen ? (
            <X size={28} className="sm:w-8 sm:h-8" />
          ) : (
            <MessageCircle size={28} className="sm:w-8 sm:h-8" />
          )}
        </div>
        
        {/* Notification Badge */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
            <span className="text-[10px] font-black text-gray-900">AI</span>
          </div>
        )}
      </button>
    </div>
  );
}
