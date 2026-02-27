import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Admin() {
  const navigate = useNavigate();
  const { login, user, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin-dashboard");
    }
  }, [user, isAdmin, navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("দয়া করে Email এবং Password দিন");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("সঠিক email address দিন");
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 Attempting admin login with .env credentials:", email);
      
      // Call backend admin login endpoint
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      const response = await fetch(`${API_BASE}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      console.log("✅ Admin login successful:", result);
      
      // Store user data
      const userData = {
        id: result.data.user.id,
        email: result.data.user.email,
        name: result.data.user.name || 'Admin',
        role: 'admin',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(result.data.user.name || 'Admin')}&background=FF3B30&color=fff&bold=true`
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAdmin", "true");
      
      // Store token if available
      if (result.data.session?.access_token) {
        localStorage.setItem("token", result.data.session.access_token);
      }
      
      toast.success(`স্বাগতম ${userData.name}! 🎉`);
      
      // Small delay to ensure localStorage is updated
      await new Promise(resolve => setTimeout(resolve, 300));
      
      navigate("/admin-dashboard");
      
    } catch (error: any) {
      console.error("❌ Admin login error:", error);
      const message = error?.message || "";
      
      if (message.includes("Invalid admin credentials")) {
        toast.error("ভুল admin email বা password। .env file check করুন।");
      } else if (message.includes("Email not confirmed")) {
        toast.error("আপনার email verify করুন");
      } else {
        toast.error("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
      
      <div className="relative w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl shadow-red-500/50 mb-6 overflow-hidden">
            <img src="/logo.jpg" alt="NRX Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Admin Login
          </h1>
          <p className="text-gray-400 font-medium">
            অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Warning Banner */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-200 text-sm font-semibold mb-1">
                🔒 Secure Admin Access
              </p>
              <p className="text-yellow-300/80 text-xs">
                শুধুমাত্র authorized admin credentials দিয়ে login করুন। সব login attempts logged থাকে।
              </p>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent transition-all"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent transition-all"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#FF3B30] to-red-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-red-500/50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  লগইন হচ্ছে...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Admin Login
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-3">
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              ← হোম পেজে ফিরে যান
            </button>
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-500 text-xs">
            Admin access required. Credentials managed in database.
          </p>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 space-y-2">
            <p className="text-gray-400 text-xs font-semibold">
              📝 Database Configuration:
            </p>
            <p className="text-gray-500 text-xs">
              Admin credentials are stored securely in the <span className="text-[#FF3B30] font-mono">settings</span> table
            </p>
            <p className="text-gray-500 text-xs">
              Default Email: <span className="text-[#FF3B30] font-mono">gunjonarka@gmail.com</span>
            </p>
            <p className="text-gray-500 text-xs">
              Default Password: <span className="text-[#FF3B30] font-mono">Admin@123456</span>
            </p>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            💡 Tip: Admin Dashboard → Settings → Admin Login থেকে credentials update করুন
          </p>
        </div>
      </div>
    </div>
  );
}
