import { RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle, Mail } from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";

export default function Refund() {
  const refundEligible = [
    "টেকনিক্যাল সমস্যার কারণে ২৪ ঘন্টার মধ্যে ডায়মন্ড না পাওয়া",
    "আমাদের পক্ষ থেকে ভুল পরিমাণ ডায়মন্ড ডেলিভারি",
    "ডুপ্লিকেট পেমেন্ট হলে",
    "সার্ভার ডাউন বা সিস্টেম ত্রুটির কারণে অর্ডার প্রসেস না হলে"
  ];

  const refundNotEligible = [
    "ভুল Player ID দিলে ডায়মন্ড অন্য অ্যাকাউন্টে চলে যাবে",
    "সঠিকভাবে ডায়মন্ড ডেলিভারি হলে",
    "অর্ডার করার পর মন পরিবর্তন করলে",
    "আপনার Free Fire অ্যাকাউন্ট ব্যান হলে",
    "২৪ ঘন্টার কম সময়ে ডেলিভারি না হলে"
  ];

  const refundProcess = [
    { step: "১", title: "রিফান্ড রিকোয়েস্ট", desc: "সাপোর্ট টিমে যোগাযোগ করুন এবং Order ID প্রদান করুন" },
    { step: "২", title: "ভেরিফিকেশন", desc: "আমরা আপনার অর্ডার এবং পেমেন্ট ভেরিফাই করব (১-২ দিন)" },
    { step: "৩", title: "অনুমোদন", desc: "রিফান্ড যোগ্য হলে আমরা আপনাকে জানাবো" },
    { step: "৪", title: "প্রসেসিং", desc: "রিফান্ড প্রসেস করা হবে (৩-৭ কার্যদিবস)" },
    { step: "৫", title: "সম্পন্ন", desc: "টাকা আপনার পেমেন্ট মেথডে ফেরত পাবেন" }
  ];

  const paymentMethods = [
    { name: "bKash", time: "৩-৫ দিন", color: "from-pink-500 to-pink-600" },
    { name: "Nagad", time: "৩-৫ দিন", color: "from-orange-500 to-red-600" },
    { name: "Rocket", time: "৫-৭ দিন", color: "from-purple-500 to-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <UnifiedNavbar />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30 mb-6">
            <RefreshCw className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
            Refund Policy
          </h1>
          <p className="text-lg text-gray-600 font-semibold">রিফান্ড নীতি</p>
          <p className="text-sm text-gray-500 mt-4">সর্বশেষ আপডেট: ফেব্রুয়ারি ২০২৬</p>
        </div>

        {/* Warning Alert */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-black mb-2">⚠️ গুরুত্বপূর্ণ সতর্কতা</h3>
              <p className="text-sm opacity-90">
                অর্ডার করার আগে সব তথ্য সাবধানে চেক করুন। ভুল Player ID দিলে রিফান্ড দেওয়া হবে না। 
                একবার ডায়মন্ড ডেলিভারি হয়ে গেলে তা ফেরত নেওয়া সম্ভব নয়।
              </p>
            </div>
          </div>
        </div>

        {/* Refund Eligibility */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Eligible */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">রিফান্ড পাবেন</h2>
                <p className="text-xs text-gray-500 font-semibold">Refund Eligible</p>
              </div>
            </div>
            <ul className="space-y-3">
              {refundEligible.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Eligible */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">রিফান্ড পাবেন না</h2>
                <p className="text-xs text-gray-500 font-semibold">Not Eligible</p>
              </div>
            </div>
            <ul className="space-y-3">
              {refundNotEligible.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Refund Process */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">রিফান্ড প্রক্রিয়া</h2>
          <div className="grid sm:grid-cols-5 gap-4">
            {refundProcess.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
                {idx < refundProcess.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-500 to-red-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Timeline */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">রিফান্ড সময়সীমা</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {paymentMethods.map((method, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${method.color} rounded-xl p-6 text-white text-center shadow-lg`}>
                <p className="text-sm font-semibold opacity-90 mb-2">{method.name}</p>
                <p className="text-3xl font-black mb-1">{method.time}</p>
                <p className="text-xs opacity-75">কার্যদিবস</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-black text-gray-900">রিকোয়েস্ট সময়সীমা</h3>
            </div>
            <p className="text-sm text-gray-700">
              অর্ডার করার <span className="font-bold text-blue-600">৭ দিনের মধ্যে</span> রিফান্ড রিকোয়েস্ট করতে হবে। 
              ৭ দিন পর কোনো রিফান্ড রিকোয়েস্ট গ্রহণ করা হবে না।
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-black text-gray-900">আংশিক রিফান্ড</h3>
            </div>
            <p className="text-sm text-gray-700">
              কিছু ক্ষেত্রে আংশিক রিফান্ড দেওয়া হতে পারে, যেমন ভুল পরিমাণ ডায়মন্ড ডেলিভারি হলে। 
              পার্থক্যের টাকা রিফান্ড করা হবে।
            </p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-8 h-8" />
            <h3 className="text-2xl font-black">রিফান্ড রিকোয়েস্ট করুন</h3>
          </div>
          <p className="mb-6 opacity-90">রিফান্ড সম্পর্কে যোগাযোগ করুন:</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-75 mb-1">Email</p>
              <p className="font-bold text-sm">refund@nrxstore.com</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-75 mb-1">WhatsApp</p>
              <p className="font-bold text-sm">+880 1883-800356</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-75 mb-1">সময়</p>
              <p className="font-bold text-sm">৯টা - ১০টা (প্রতিদিন)</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm italic">
              💡 রিফান্ড রিকোয়েস্ট করার সময় অবশ্যই <span className="font-bold">Order ID</span> এবং <span className="font-bold">Transaction ID</span> প্রদান করুন।
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
