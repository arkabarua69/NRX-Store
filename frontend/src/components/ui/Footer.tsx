import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Send,
  Shield,
  Zap,
  Clock,
  Award,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface Settings {
  supportWhatsapp: string;
  supportEmail: string;
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    supportWhatsapp: "+8801883800356",
    supportEmail: "support@nrxstore.com"
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_BASE}/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings({
          supportWhatsapp: data.supportWhatsapp || "+8801883800356",
          supportEmail: data.supportEmail || "support@nrxstore.com"
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      // Keep default values
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("ইমেইল লিখুন! Please enter email");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      toast.success("সাবস্ক্রাইব সফল! Newsletter subscribed!");
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "হোম", nameEn: "Home", path: "/" },
    { name: "স্টোর", nameEn: "Store", path: "/store" },
    { name: "ড্যাশবোর্ড", nameEn: "Dashboard", path: "/dashboard" },
    { name: "সম্পর্কে", nameEn: "About", path: "/about" },
    { name: "FAQ", nameEn: "Help", path: "/faq" },
    { name: "শর্তাবলী", nameEn: "Terms", path: "/terms" }
  ];

  const features = [
    { icon: Shield, title: "নিরাপদ", subtitle: "100% Secure", color: "from-green-500 to-emerald-600" },
    { icon: Zap, title: "দ্রুত", subtitle: "5-30 Minutes", color: "from-yellow-500 to-orange-600" },
    { icon: Clock, title: "২৪/৭", subtitle: "Always Available", color: "from-blue-500 to-cyan-600" },
    { icon: Award, title: "বিশ্বস্ত", subtitle: "Trusted Store", color: "from-purple-500 to-pink-600" }
  ];

  const socialLinks = [
    { icon: Facebook, url: "https://www.facebook.com/profile.php?id=61553593169227", color: "hover:bg-blue-600" },
    { icon: Instagram, url: "https://instagram.com", color: "hover:bg-pink-600" },
    { icon: Twitter, url: "https://twitter.com", color: "hover:bg-sky-500" },
    { icon: Youtube, url: "https://youtube.com", color: "hover:bg-red-600" }
  ];

  return (
    <footer className="hidden lg:block relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF3B30]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden">
                <img
                  src="/logo.jpg"
                  alt="NRX Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-black">NRX Store</h3>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Sparkles size={10} className="text-[#FF3B30]" />
                  Premium Diamond Shop
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              বাংলাদেশের সবচেয়ে বিশ্বস্ত Free Fire ডায়মন্ড স্টোর। দ্রুত ডেলিভারি, নিরাপদ পেমেন্ট এবং ২৪/৭ সাপোর্ট।
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-[#FF3B30] to-[#FF6B30] rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] group-hover:w-2.5 transition-all" />
                    {link.name} - {link.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-[#FF3B30] to-[#FF6B30] rounded-full" />
              যোগাযোগ
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold">WhatsApp</p>
                  <a 
                    href={`https://wa.me/${(settings.supportWhatsapp || '').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold hover:text-green-400 transition-colors flex items-center gap-1"
                  >
                    {settings.supportWhatsapp || "+8801883800356"}
                    <ExternalLink size={10} />
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#FF3B30] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold">Email</p>
                  <a 
                    href={`mailto:${settings.supportEmail}`} 
                    className="text-xs font-bold hover:text-[#FF3B30] transition-colors break-all"
                  >
                    {settings.supportEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold">Location</p>
                  <p className="text-xs font-bold">Dhaka, Bangladesh</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-[#FF3B30] to-[#FF6B30] rounded-full" />
              Newsletter
            </h4>
            <p className="text-xs text-gray-400">
              অফার এবং আপডেট পেতে সাবস্ক্রাইব করুন!
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল"
                  className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B30] transition-all"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-sm rounded-lg bg-gradient-to-r from-[#FF3B30] to-[#FF6B30] text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Subscribing...</span>
                  </div>
                ) : (
                  <>
                    <Send size={14} />
                    সাবস্ক্রাইব
                  </>
                )}
              </button>
            </form>
            
            {/* Social Links */}
            <div className="pt-3 border-t border-white/10">
              <p className="text-[10px] text-gray-500 font-semibold mb-2">Follow Us</p>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-8 h-8 rounded-lg bg-white/5 ${social.color} flex items-center justify-center transition-all hover:scale-110`}
                  >
                    <social.icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-y border-white/10">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{feature.title}</p>
                <p className="text-[10px] text-gray-400">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-xs text-gray-400 text-center md:text-left">
            © {currentYear} <span className="font-bold text-white">NRX Diamond Store</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            Made with <span className="text-[#FF3B30]">❤</span> by <span className="font-bold text-white">Mac GunJon</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/refund" className="text-gray-400 hover:text-white transition-colors">
              Refund
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
