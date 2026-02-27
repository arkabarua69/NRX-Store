import { Link } from "react-router-dom";
import { Shield, Zap, Sparkles } from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />

      <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF3B30] to-[#FF6B30] flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">পেজ পাওয়া যায়নি</h2>
          <p className="text-xl text-gray-600 mb-8">The page you are looking for doesn't exist</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">নিরাপদ</h3>
              <p className="text-sm text-gray-600">সম্পূর্ণ নিরাপদ সাইট</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">দ্রুত</h3>
              <p className="text-sm text-gray-600">৫-৩০ মিনিটে ডেলিভারি</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">বিশ্বস্ত</h3>
              <p className="text-sm text-gray-600">১০০% নির্ভরযোগ্য</p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF3B30] to-[#FF6B30] text-white font-bold text-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            <Sparkles size={20} />
            হোম পেজে যান - Go Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
