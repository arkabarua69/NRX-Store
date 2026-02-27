import { FileText, ShoppingCart, Clock, Ban, AlertTriangle, Phone } from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";

export default function Terms() {
  const terms = [
    {
      icon: ShoppingCart,
      title: "১. অর্ডার ও পেমেন্ট",
      titleEn: "Order & Payment",
      color: "from-blue-500 to-cyan-600",
      items: [
        "সব অর্ডার সঠিক Player ID দিয়ে করতে হবে",
        "পেমেন্ট করার পর অর্ডার ক্যান্সেল করা যাবে না",
        "ভুল তথ্য দেওয়ার জন্য আমরা দায়ী নই",
        "Transaction ID সঠিকভাবে প্রদান করতে হবে"
      ]
    },
    {
      icon: Clock,
      title: "২. ডেলিভারি সময়",
      titleEn: "Delivery Time",
      color: "from-green-500 to-emerald-600",
      items: [
        "সাধারণত ৫-৩০ মিনিটের মধ্যে ডেলিভারি",
        "ব্যস্ত সময়ে ১-২ ঘন্টা লাগতে পারে",
        "২৪ ঘন্টার মধ্যে ডেলিভারি না হলে সম্পূর্ণ রিফান্ড",
        "টেকনিক্যাল সমস্যায় বিলম্ব হতে পারে"
      ]
    },
    {
      icon: AlertTriangle,
      title: "৩. ব্যবহারকারীর দায়িত্ব",
      titleEn: "User Responsibility",
      color: "from-orange-500 to-red-600",
      items: [
        "সঠিক এবং বৈধ তথ্য প্রদান করা",
        "নিজের অ্যাকাউন্ট সুরক্ষিত রাখা",
        "অবৈধ কার্যকলাপে জড়িত না হওয়া",
        "পেমেন্ট প্রমাণ সংরক্ষণ করা"
      ]
    },
    {
      icon: Ban,
      title: "৪. নিষিদ্ধ কার্যকলাপ",
      titleEn: "Prohibited Activities",
      color: "from-red-500 to-pink-600",
      items: [
        "জাল বা ভুয়া তথ্য প্রদান করা",
        "অন্যের অ্যাকাউন্ট ব্যবহার করা",
        "চার্জব্যাক বা পেমেন্ট বিতর্ক তৈরি করা",
        "সিস্টেম হ্যাক বা ক্ষতি করার চেষ্টা"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <UnifiedNavbar />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg shadow-gray-500/30 mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600 font-semibold">শর্তাবলী - নিয়ম ও শর্ত</p>
          <p className="text-sm text-gray-500 mt-4">সর্বশেষ আপডেট: ফেব্রুয়ারি ২০২৬</p>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-black mb-2">গুরুত্বপূর্ণ নোটিশ</h3>
              <p className="text-sm opacity-90">
                NRX Diamond Store এর সেবা ব্যবহার করার মাধ্যমে আপনি এই শর্তাবলীতে সম্মত হচ্ছেন। 
                আপনি যদি এই শর্তাবলীর সাথে একমত না হন, তাহলে আমাদের সেবা ব্যবহার করবেন না।
              </p>
            </div>
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {terms.map((term, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${term.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <term.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">{term.title}</h2>
                  <p className="text-xs text-gray-500 font-semibold">{term.titleEn}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {term.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FF3B30] to-purple-500 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Refund Policy Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 mb-8">
          <h3 className="text-xl font-black text-gray-900 mb-3">রিফান্ড পলিসি</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-bold text-green-600 mb-2">✓ রিফান্ড পাবেন:</p>
              <ul className="space-y-1 text-xs">
                <li>• টেকনিক্যাল সমস্যায় ডায়মন্ড না পেলে</li>
                <li>• ২৪ ঘন্টার মধ্যে ডেলিভারি না হলে</li>
                <li>• ভুল পরিমাণ ডায়মন্ড ডেলিভারি হলে</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-red-600 mb-2">✗ রিফান্ড পাবেন না:</p>
              <ul className="space-y-1 text-xs">
                <li>• ভুল Player ID দিলে</li>
                <li>• সঠিকভাবে ডায়মন্ড ডেলিভারি হলে</li>
                <li>• মন পরিবর্তন করলে</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Liability Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 mb-8">
          <h3 className="text-xl font-black text-gray-900 mb-3">দায় সীমাবদ্ধতা</h3>
          <p className="text-sm text-gray-700">
            আমরা আমাদের সেবা "যেমন আছে" ভিত্তিতে প্রদান করি। Free Fire গেম বা Garena এর কোনো সমস্যার জন্য 
            আমরা দায়ী নই। আমরা শুধুমাত্র ডায়মন্ড টপ-আপ সেবা প্রদান করি।
          </p>
        </div>

        {/* Contact Card */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-8 h-8" />
            <h3 className="text-2xl font-black">যোগাযোগ করুন</h3>
          </div>
          <p className="mb-6 opacity-90">এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-75 mb-1">Email</p>
              <p className="font-bold text-sm">support@nrxstore.com</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-75 mb-1">WhatsApp</p>
              <p className="font-bold text-sm">+880 1883-800356</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-75 mb-1">Address</p>
              <p className="font-bold text-sm">Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
