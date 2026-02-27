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
    <div className="min-h-screen bg-white font-sans text-[#333] flex flex-col">
      <UnifiedNavbar />
      <div className="flex-1 flex pt-20">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-12 flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 text-white space-y-12">
            <div>
              <h2 className="text-5xl font-black mb-6 leading-tight">দ্রুততম ডায়মন্ড<br />টপ-আপ সেবা</h2>
              <p className="text-xl text-white/90 font-medium">সবচেয়ে নিরাপদ এবং দ্রুত Free Fire ডায়মন্ড কিনুন</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black mb-1">তাৎক্ষণিক ডেলিভারি</h3>
                  <p className="text-white/80 text-sm">৫-১৫ মিনিটের মধ্যে ডায়মন্ড পাবেন</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-1">10K+</div>
                <div className="text-sm text-white/80 font-semibold">সন্তুষ্ট গ্রাহক</div>
              </div>
            </div>
          </div>
        </div>


        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-gray-900 mb-2">{isSignUp ? "নতুন অ্যাকাউন্ট" : "স্বাগতম!"}</h3>
              <p className="text-gray-600 font-medium">{isSignUp ? "Create your account" : "Sign in to continue"}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <form onSubmit={handleAuthAction} className="space-y-5">
                {isSignUp && (
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">নাম</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" name="name" placeholder="আপনার নাম" onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all font-medium" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">ইমেইল</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" name="email" required placeholder="your@email.com" onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all font-medium" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">পাসওয়ার্ড</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} name="password" required placeholder="••••••••" onChange={handleChange} className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all font-medium" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {error && <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-sm font-semibold text-red-600">{error}</div>}
                <button disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-black text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70">
                  {loading ? "অপেক্ষা করুন..." : isSignUp ? "অ্যাকাউন্ট তৈরি করুন" : "প্রবেশ করুন"}
                </button>
              </form>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-bold text-gray-400 uppercase">অথবা</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" disabled={loading} onClick={() => handleSocialLogin("google")} className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-70">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
                  Google
                </button>
                <button type="button" disabled={loading} onClick={() => handleSocialLogin("discord")} className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-70">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" /></svg>
                  Discord
                </button>
              </div>
              <div className="text-center mt-6">
                <p className="text-gray-600 font-medium">{isSignUp ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
                  <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(""); }} className="text-purple-600 font-black hover:underline">
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
