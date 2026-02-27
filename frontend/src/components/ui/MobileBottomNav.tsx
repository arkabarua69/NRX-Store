import { Home, ShoppingBag, User, Menu, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface MobileBottomNavProps {
  onMenuClick: () => void;
}

export default function MobileBottomNav({ onMenuClick }: MobileBottomNavProps) {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t-2 border-gray-200 shadow-2xl shadow-gray-900/10">
      <div className="grid grid-cols-5 h-16">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            isActive("/")
              ? "text-[#FF3B30]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className={`p-2 rounded-2xl transition-all ${isActive("/") ? "bg-red-50 scale-110" : ""}`}>
            <Home size={22} strokeWidth={isActive("/") ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-bold">হোম</span>
        </Link>

        {/* Store */}
        <Link
          to="/store"
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            isActive("/store")
              ? "text-[#FF3B30]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className={`p-2 rounded-2xl transition-all ${isActive("/store") ? "bg-red-50 scale-110" : ""}`}>
            <ShoppingBag size={22} strokeWidth={isActive("/store") ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-bold">কিনুন</span>
        </Link>

        {/* Menu */}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-gray-700 transition-all relative"
        >
          <div className="absolute -top-3 w-14 h-14 rounded-full bg-gradient-to-br from-[#FF3B30] to-red-600 flex items-center justify-center shadow-xl shadow-red-500/30 border-4 border-white">
            <Menu size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-bold mt-8">মেনু</span>
        </button>

        {/* Notifications */}
        {user ? (
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              isActive("/dashboard")
                ? "text-[#FF3B30]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all ${isActive("/dashboard") ? "bg-red-50 scale-110" : ""}`}>
              <Bell size={22} strokeWidth={isActive("/dashboard") ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold">বিজ্ঞপ্তি</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-gray-700 transition-all"
          >
            <div className="p-2 rounded-2xl">
              <User size={22} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-bold">লগইন</span>
          </Link>
        )}

        {/* Profile */}
        {user ? (
          <Link
            to="/settings"
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              isActive("/settings")
                ? "text-[#FF3B30]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all ${isActive("/settings") ? "bg-red-50 scale-110" : ""}`}>
              <User size={22} strokeWidth={isActive("/settings") ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold">প্রোফাইল</span>
          </Link>
        ) : (
          <Link
            to="/login?signup=true"
            className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-gray-700 transition-all"
          >
            <div className="p-2 rounded-2xl">
              <User size={22} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-bold">সাইনআপ</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
