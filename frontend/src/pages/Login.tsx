import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, loginWithDiscord } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === 'true') {
      setError("সেশন মেয়াদ শেষ। আবার লগইন করুন। - Session expired. Please login again.");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!formData.email || !formData.password) {
        setError("ইমেইল এবং পাসওয়ার্ড প্রয়োজন - Email and password required");
        setLoading(false);
        return;
      }
      if (isSignUp) {
        if (!formData.name || formData.name.trim().length < 2) {
          setError("নাম কমপক্ষে ২ অক্ষরের হতে হবে - Name must be at least 2 characters");
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে - Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        await register(formData.name, formData.email, formData.password);
        alert("অ্যাকাউন্ট তৈরি সফল! - Account created!");
      } else {
        await login(formData.email, formData.password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'discord') => {
    setError("");
    setLoading(true);
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithDiscord();
    } catch (err: any) {
      setError(err?.message || `${provider} login failed`);
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 font-sans flex flex-col">
      <UnifiedNavbar />
      
      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Hero Section */}
          <div className="hidden lg:block space-y-8 px-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                <Sparkles size={16} />
                <span>Trusted by 10,000+ Gamers</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                দ্রুততম<br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  ডায়মন্ড টপ-আপ
                </span>
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                সবচেয়ে নিরাপদ এবং দ্রুত Free Fire ডায়মন্ড কিনুন
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">তাৎক্ষণিক ডেলিভারি</h3>
                  <p className="text-sm text-gray-600">৫-১৫ মিনিটের মধ্যে</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Lock className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">১০০% নিরাপদ</h3>
                  <p className="text-sm text-gray-600">সুরক্ষিত পেমেন্ট সিস্টেম</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">10K+</div>
                <div className="text-xs text-gray-600 font-semibold mt-1">গ্রাহক</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">24/7</div>
                <div className="text-xs text-gray-600 font-semibold mt-1">সাপোর্ট</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">5★</div>
                <div className="text-xs text-gray-600 font-semibold mt-1">রেটিং</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Hero */}
            <div className="lg:hidden text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                {isSignUp ? "নতুন অ্যাকাউন্ট" : "স্বাগতম!"}
              </h2>
              <p className="text-gray-600">{isSignUp ? "Create your account" : "Sign in to continue"}</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              {/* Desktop Title */}
              <div className="hidden lg:block text-center mb-6">
                <h3 className="text-2xl font-black text-gray-900 mb-1">
                  {isSignUp ? "নতুন অ্যাকাউন্ট" : "স্বাগতম!"}
                </h3>
                <p className="text-sm text-gray-600">{isSignUp ? "Create your account" : "Sign in to continue"}</p>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                <button 
                  type="button" 
                  disabled={loading} 
                  onClick={() => handleSocialLogin("google")} 
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 hover:border-purple-300 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                  <span>Continue with Google</span>
                </button>
                
                <button 
                  type="button" 
                  disabled={loading} 
                  onClick={() => handleSocialLogin("discord")} 
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 hover:border-purple-300 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  <span>Continue with Discord</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-bold text-gray-400 uppercase">Or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleAuthAction} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="আপনার নাম লিখুন" 
                        onChange={handleChange} 
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all font-medium outline-none" 
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      placeholder="your@email.com" 
                      onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all font-medium outline-none" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      required 
                      placeholder="••••••••" 
                      onChange={handleChange} 
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all font-medium outline-none" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-sm font-semibold text-red-600 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                <button 
                  disabled={loading} 
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-black text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>অপেক্ষা করুন...</span>
                    </span>
                  ) : (
                    isSignUp ? "অ্যাকাউন্ট তৈরি করুন" : "প্রবেশ করুন"
                  )}
                </button>
              </form>

              {/* Toggle Sign In/Up */}
              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  {isSignUp ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
                  <button 
                    type="button" 
                    onClick={() => { setIsSignUp(!isSignUp); setError(""); setFormData({ name: "", email: "", password: "" }); }} 
                    className="text-purple-600 font-bold hover:underline transition-all"
                  >
                    {isSignUp ? "সাইন ইন করুন" : "সাইন আপ করুন"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
