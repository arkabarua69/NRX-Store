import { Shield, Lock, Eye, UserCheck, Database, Bell } from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";

export default function Privacy() {
  const sections = [
    {
      icon: Database,
      title: "১. তথ্য সংগ্রহ",
      titleEn: "Information Collection",
      content: "আমরা নিম্নলিখিত তথ্য সংগ্রহ করি:",
      items: [
        "ব্যক্তিগত তথ্য: নাম, ইমেইল, ফোন নম্বর",
        "গেম তথ্য: Free Fire Player ID",
        "পেমেন্ট তথ্য: Transaction ID, পেমেন্ট মেথড",
        "ডিভাইস তথ্য: IP address, ব্রাউজার টাইপ"
      ]
    },
    {
      icon: Eye,
      title: "২. তথ্য ব্যবহার",
      titleEn: "Information Usage",
      content: "আমরা আপনার তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:",
      items: [
        "অর্ডার প্রসেস এবং ডায়মন্ড ডেলিভারি করতে",
        "কাস্টমার সাপোর্ট প্রদান করতে",
        "পেমেন্ট ভেরিফাই করতে",
        "জালিয়াতি প্রতিরোধ করতে",
        "সেবা উন্নত করতে"
      ]
    },
    {
      icon: Lock,
      title: "৩. তথ্য সুরক্ষা",
      titleEn: "Data Security",
      content: "আমরা আপনার তথ্য সুরক্ষিত রাখতে শিল্প-মান নিরাপত্তা ব্যবস্থা ব্যবহার করি। আপনার পেমেন্ট তথ্য এনক্রিপ্ট করা হয় এবং নিরাপদ সার্ভারে সংরক্ষণ করা হয়।",
      items: []
    },
    {
      icon: UserCheck,
      title: "৪. আপনার অধিকার",
      titleEn: "Your Rights",
      content: "আপনার নিম্নলিখিত অধিকার রয়েছে:",
      items: [
        "আপনার তথ্য দেখার অধিকার",
        "আপনার তথ্য সংশোধন করার অধিকার",
        "আপনার তথ্য মুছে ফেলার অধিকার",
        "ডেটা প্রসেসিং এ আপত্তি করার অধিকার"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <UnifiedNavbar />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 font-semibold">গোপনীয়তা নীতি</p>
          <p className="text-sm text-gray-500 mt-4">সর্বশেষ আপডেট: ফেব্রুয়ারি ২০২৬</p>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
          <p className="text-gray-700 leading-relaxed text-center">
            NRX Diamond Store আপনার গোপনীয়তাকে অত্যন্ত গুরুত্ব দেয়। এই গোপনীয়তা নীতি ব্যাখ্যা করে 
            কিভাবে আমরা আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি।
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">{section.title}</h2>
                  <p className="text-xs text-gray-500 font-semibold">{section.titleEn}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">{section.content}</p>
              {section.items.length > 0 && (
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              কুকিজ ব্যবহার
            </h3>
            <p className="text-sm text-gray-700">
              আমরা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে এবং সাইট ব্যবহার বিশ্লেষণ করতে কুকিজ ব্যবহার করি। 
              আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে কুকিজ নিষ্ক্রিয় করতে পারেন।
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              শিশুদের গোপনীয়তা
            </h3>
            <p className="text-sm text-gray-700">
              আমাদের সেবা ১৮ বছরের কম বয়সীদের জন্য নয়। আমরা জেনেশুনে ১৮ বছরের কম বয়সীদের 
              কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করি না।
            </p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-lg">
          <h3 className="text-2xl font-black mb-4">যোগাযোগ করুন</h3>
          <p className="mb-6 opacity-90">গোপনীয়তা সম্পর্কে কোনো প্রশ্ন থাকলে যোগাযোগ করুন:</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-75 mb-1">Email</p>
              <p className="font-bold">privacy@nrxstore.com</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-75 mb-1">WhatsApp</p>
              <p className="font-bold">+880 1883-800356</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-75 mb-1">Address</p>
              <p className="font-bold">Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
