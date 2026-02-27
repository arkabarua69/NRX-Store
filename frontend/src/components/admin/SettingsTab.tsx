import { useState, useEffect } from "react";
import { SiteSettings } from "@/lib/settingsService";
import { 
  Save, Plus, X, Globe, CreditCard, Bell, Shield, 
  Palette, Mail, Phone, MessageSquare, Settings as SettingsIcon,
  Eye, EyeOff, Copy, Check, Zap, Lock, AlertCircle,
  Image, Link, Code, Database, Server, Wifi, WifiOff, 
  Smartphone, Monitor, Sparkles, TrendingUp, Users
} from "lucide-react";
import { updateSettings } from "@/lib/adminService";
import { toast } from "sonner";

interface SettingsTabProps {
  settings: SiteSettings;
}

export default function SettingsTab({ settings }: SettingsTabProps) {
  const [formData, setFormData] = useState<SiteSettings>(settings || {
    adminEmails: [],
    paymentMethods: {
      bkash: { number: "", type: "Send Money", logo: "", enabled: true },
      nagad: { number: "", type: "Send Money", logo: "", enabled: true },
      rocket: { number: "", type: "Send Money", logo: "", enabled: true },
    },
    siteName: "NRX Store",
    siteNameBn: "এনআরএক্স স্টোর",
    supportWhatsapp: "",
    supportEmail: "",
    maintenanceMode: false,
    announcementBanner: { enabled: false, message: "", messageBn: "", type: "info" },
  });
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("general");
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Admin credentials state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [updatingCredentials, setUpdatingCredentials] = useState(false);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update formData when settings prop changes
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);
  
  // Load admin credentials
  useEffect(() => {
    const loadAdminCredentials = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        
        const response = await fetch(`${API_BASE}/settings/admin-credentials`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setAdminEmail(result.data.email || "");
        }
      } catch (error) {
        console.error("Error loading admin credentials:", error);
      }
    };
    
    loadAdminCredentials();
  }, []);

  // Safety check for payment methods
  const safePaymentMethods = formData.paymentMethods || {
    bkash: { number: "", type: "Send Money", logo: "", enabled: true },
    nagad: { number: "", type: "Send Money", logo: "", enabled: true },
    rocket: { number: "", type: "Send Money", logo: "", enabled: true },
  };

  // Safety check for admin emails
  const safeAdminEmails = formData.adminEmails || [];
  
  // Safety check for maintenance mode
  const safeMaintenanceMode = formData.maintenanceMode || false;
  
  // Safety checks for other properties
  const safeSiteName = formData.siteName || "NRX Store";
  const safeSiteNameBn = formData.siteNameBn || "এনআরএক্স স্টোর";
  const safeSupportWhatsapp = formData.supportWhatsapp || "";
  const safeSupportEmail = formData.supportEmail || "";
  const safeAnnouncementBanner = formData.announcementBanner || { enabled: false, message: "", messageBn: "", type: "info" };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(formData);
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail || !newAdminEmail.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    
    if (safeAdminEmails.includes(newAdminEmail)) {
      toast.error("Email already exists");
      return;
    }

    setFormData({
      ...formData,
      adminEmails: [...safeAdminEmails, newAdminEmail],
    });
    setNewAdminEmail("");
    toast.success("Admin email added");
  };

  const handleRemoveAdmin = (email: string) => {
    if (safeAdminEmails.length === 1) {
      toast.error("Cannot remove the last admin");
      return;
    }
    
    setFormData({
      ...formData,
      adminEmails: safeAdminEmails.filter((e: string) => e !== email),
    });
    toast.success("Admin email removed");
  };
  
  const handleUpdateAdminCredentials = async () => {
    if (!adminEmail || !adminEmail.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    
    if (!adminPassword || adminPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setUpdatingCredentials(true);
    
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE}/settings/admin-credentials`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update credentials');
      }
      
      toast.success("Admin credentials updated successfully! 🎉");
      setAdminPassword(""); // Clear password field
      
    } catch (error: any) {
      console.error("Error updating admin credentials:", error);
      toast.error(error.message || "Failed to update admin credentials");
    } finally {
      setUpdatingCredentials(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const sections = [
    { id: "general", label: "General", icon: Globe, color: "from-blue-500 to-cyan-500" },
    { id: "admin-login", label: "Admin Login", icon: Lock, color: "from-red-600 to-rose-600" },
    { id: "payment", label: "Payment", icon: CreditCard, color: "from-green-500 to-emerald-500" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "from-yellow-500 to-orange-500" },
    { id: "security", label: "Security", icon: Shield, color: "from-red-500 to-pink-500" },
    { id: "appearance", label: "Appearance", icon: Palette, color: "from-purple-500 to-indigo-500" },
    { id: "advanced", label: "Advanced", icon: SettingsIcon, color: "from-gray-500 to-slate-500" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 sm:pb-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <Globe size={isMobile ? 18 : 24} />
            <TrendingUp size={isMobile ? 14 : 20} className="opacity-70" />
          </div>
          <p className="text-base sm:text-2xl font-black truncate">{safeSiteName}</p>
          <p className="text-[10px] sm:text-sm opacity-80">{isMobile ? 'সাইট' : 'Site Name'}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <CreditCard size={isMobile ? 18 : 24} />
            <Check size={isMobile ? 14 : 20} className="opacity-70" />
          </div>
          <p className="text-base sm:text-2xl font-black">
            {Object.values(safePaymentMethods).filter((m: any) => m.enabled).length}
          </p>
          <p className="text-[10px] sm:text-sm opacity-80">{isMobile ? 'পেমেন্ট' : 'Payments'}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <Users size={isMobile ? 18 : 24} />
            <Shield size={isMobile ? 14 : 20} className="opacity-70" />
          </div>
          <p className="text-base sm:text-2xl font-black">{safeAdminEmails.length}</p>
          <p className="text-[10px] sm:text-sm opacity-80">{isMobile ? 'অ্যাডমিন' : 'Admins'}</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            {safeMaintenanceMode ? <WifiOff size={isMobile ? 18 : 24} /> : <Wifi size={isMobile ? 18 : 24} />}
            <AlertCircle size={isMobile ? 14 : 20} className="opacity-70" />
          </div>
          <p className="text-base sm:text-2xl font-black">{safeMaintenanceMode ? "OFF" : "ON"}</p>
          <p className="text-[10px] sm:text-sm opacity-80">{isMobile ? 'স্ট্যাটাস' : 'Status'}</p>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-2 mb-4 sm:mb-6">
        <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-7'} gap-2`}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 ${
                activeSection === section.id
                  ? "bg-gradient-to-br " + section.color + " text-white shadow-lg scale-105"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <section.icon size={isMobile ? 18 : 24} />
              <span className="text-[10px] sm:text-xs text-center leading-tight">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-8">
        {/* General Section */}
        {activeSection === "general" && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Globe className="text-white" size={isMobile ? 20 : 24} />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-gray-900">
                  {isMobile ? 'জেনারেল' : 'General Settings'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {isMobile ? 'সাইট তথ্য' : 'Configure basic site information'}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700">
                  <Globe size={isMobile ? 14 : 16} />
                  {isMobile ? 'সাইট নাম (EN)' : 'Site Name (English)'}
                </label>
                <input
                  type="text"
                  value={safeSiteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all text-sm"
                  placeholder="Enter site name"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700">
                  <Globe size={isMobile ? 14 : 16} />
                  {isMobile ? 'সাইট নাম (BN)' : 'Site Name (Bengali)'}
                </label>
                <input
                  type="text"
                  value={safeSiteNameBn}
                  onChange={(e) => setFormData({ ...formData, siteNameBn: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all text-sm"
                  placeholder="সাইটের নাম লিখুন"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700">
                  <Phone size={isMobile ? 14 : 16} />
                  {isMobile ? 'হোয়াটসঅ্যাপ' : 'Support WhatsApp'}
                </label>
                <input
                  type="text"
                  value={safeSupportWhatsapp}
                  onChange={(e) => setFormData({ ...formData, supportWhatsapp: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all text-sm"
                  placeholder="8801XXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700">
                  <Mail size={isMobile ? 14 : 16} />
                  {isMobile ? 'ইমেইল' : 'Support Email'}
                </label>
                <input
                  type="email"
                  value={safeSupportEmail}
                  onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                  placeholder="support@example.com"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="text-white" size={isMobile ? 20 : 24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base sm:text-lg font-black text-gray-900">
                      {isMobile ? 'মেইনটেনেন্স মোড' : 'Maintenance Mode'}
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={safeMaintenanceMode}
                        onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 sm:w-14 sm:h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 sm:after:h-6 sm:after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {isMobile 
                      ? 'সাইট বন্ধ থাকবে। শুধু অ্যাডমিন অ্যাক্সেস করতে পারবে।'
                      : 'When enabled, the site will be unavailable to regular users. Only admins can access.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Login Section */}
        {activeSection === "admin-login" && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center">
                <Lock className="text-white" size={isMobile ? 20 : 24} />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-gray-900">
                  {isMobile ? 'অ্যাডমিন লগইন' : 'Admin Login Credentials'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {isMobile ? 'ইমেইল ও পাসওয়ার্ড' : 'Manage admin login email and password'}
                </p>
              </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={isMobile ? 16 : 20} />
              <div>
                <p className="text-red-900 font-bold text-xs sm:text-sm mb-1">🔒 {isMobile ? 'সিকিউরিটি' : 'Security Warning'}</p>
                <p className="text-red-700 text-[10px] sm:text-xs">
                  {isMobile 
                    ? 'এই তথ্য দিয়ে অ্যাডমিন লগইন করতে হবে। শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।'
                    : 'These credentials are used to login to the admin dashboard. Keep them secure and use a strong password.'
                  }
                </p>
              </div>
            </div>

            {/* Admin Email */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-gray-200">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <Mail className="text-gray-700" size={isMobile ? 16 : 20} />
                <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                  {isMobile ? 'ইমেইল' : 'Admin Email'}
                </h4>
              </div>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
              />
              <p className="text-[10px] sm:text-xs text-gray-600 mt-2">
                {isMobile ? 'লগইন ইমেইল' : 'This email will be used to login to the admin dashboard'}
              </p>
            </div>

            {/* Admin Password */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-gray-200">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <Lock className="text-gray-700" size={isMobile ? 16 : 20} />
                <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                  {isMobile ? 'পাসওয়ার্ড' : 'Admin Password'}
                </h4>
              </div>
              <div className="relative">
                <input
                  type={showAdminPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder={isMobile ? "নতুন পাসওয়ার্ড (৮+ অক্ষর)" : "Enter new password (min 8 characters)"}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 bg-white border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                >
                  {showAdminPassword ? <EyeOff size={isMobile ? 16 : 20} /> : <Eye size={isMobile ? 16 : 20} />}
                </button>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-2">
                {isMobile ? 'পাসওয়ার্ড এনক্রিপ্ট করা হবে' : 'Password must be at least 8 characters. It will be encrypted before storing.'}
              </p>
            </div>

            {/* Update Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pt-3 sm:pt-4 border-t-2 border-gray-200">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <Shield size={isMobile ? 14 : 16} />
                <span>{isMobile ? 'bcrypt এনক্রিপশন' : 'Password is encrypted with bcrypt'}</span>
              </div>
              <button
                onClick={handleUpdateAdminCredentials}
                disabled={updatingCredentials || !adminEmail || !adminPassword}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-lg sm:rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 text-sm"
              >
                {updatingCredentials ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isMobile ? 'আপডেট হচ্ছে...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <Save size={isMobile ? 16 : 20} />
                    {isMobile ? 'আপডেট করুন' : 'Update Credentials'}
                  </>
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-blue-900 font-bold text-sm mb-1">💡 How it works</p>
                  <ul className="text-blue-700 text-xs space-y-1">
                    <li>• Admin credentials are stored securely in the database</li>
                    <li>• Password is hashed using bcrypt encryption</li>
                    <li>• Use these credentials on the /admin login page</li>
                    <li>• You can change email and password anytime from here</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Section */}
        {activeSection === "payment" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CreditCard className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">Payment Methods</h3>
                <p className="text-sm text-gray-600">Configure payment gateways</p>
              </div>
            </div>

            <div className="grid gap-6">
              {/* bKash */}
              <div className="bg-gradient-to-br from-pink-50 to-red-50 border-2 border-pink-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
                      <Smartphone className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900">bKash</h4>
                      <p className="text-sm text-gray-600">Mobile Financial Service</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safePaymentMethods.bkash.enabled}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentMethods: {
                          ...safePaymentMethods,
                          bkash: { ...safePaymentMethods.bkash, enabled: e.target.checked }
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-600"></div>
                  </label>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Account Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={safePaymentMethods.bkash.number}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentMethods: {
                            ...safePaymentMethods,
                            bkash: { ...safePaymentMethods.bkash, number: e.target.value }
                          }
                        })}
                        placeholder="+8801XXXXXXXXX"
                        className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(safePaymentMethods.bkash.number, "bkash")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copiedField === "bkash" ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Current: {safePaymentMethods.bkash.number || "Not set"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Account Type</label>
                    <select
                      value={safePaymentMethods.bkash.type}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentMethods: {
                          ...safePaymentMethods,
                          bkash: { ...safePaymentMethods.bkash, type: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
                    >
                      <option value="Send Money">Send Money</option>
                      <option value="Personal">Personal</option>
                      <option value="Agent">Agent</option>
                      <option value="Merchant">Merchant</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Nagad */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                      <Smartphone className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900">Nagad</h4>
                      <p className="text-sm text-gray-600">Digital Financial Service</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safePaymentMethods.nagad.enabled}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentMethods: {
                          ...safePaymentMethods,
                          nagad: { ...safePaymentMethods.nagad, enabled: e.target.checked }
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Account Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={safePaymentMethods.nagad.number}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentMethods: {
                            ...safePaymentMethods,
                            nagad: { ...safePaymentMethods.nagad, number: e.target.value }
                          }
                        })}
                        placeholder="+8801XXXXXXXXX"
                        className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(safePaymentMethods.nagad.number, "nagad")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copiedField === "nagad" ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Current: {safePaymentMethods.nagad.number || "Not set"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Account Type</label>
                    <select
                      value={safePaymentMethods.nagad.type}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentMethods: {
                          ...safePaymentMethods,
                          nagad: { ...safePaymentMethods.nagad, type: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Send Money">Send Money</option>
                      <option value="Personal">Personal</option>
                      <option value="Agent">Agent</option>
                      <option value="Merchant">Merchant</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Rocket */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <Zap className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900">Rocket</h4>
                      <p className="text-sm text-gray-600">DBBL Mobile Banking</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safePaymentMethods.rocket.enabled}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentMethods: {
                          ...safePaymentMethods,
                          rocket: { ...safePaymentMethods.rocket, enabled: e.target.checked }
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Account Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={safePaymentMethods.rocket.number}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentMethods: {
                            ...safePaymentMethods,
                            rocket: { ...safePaymentMethods.rocket, number: e.target.value }
                          }
                        })}
                        placeholder="+8801XXXXXXXXX"
                        className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(safePaymentMethods.rocket.number, "rocket")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copiedField === "rocket" ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Current: {safePaymentMethods.rocket.number || "Not set"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Account Type</label>
                    <select
                      value={safePaymentMethods.rocket.type}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentMethods: {
                          ...safePaymentMethods,
                          rocket: { ...safePaymentMethods.rocket, type: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="Send Money">Send Money</option>
                      <option value="Personal">Personal</option>
                      <option value="Agent">Agent</option>
                      <option value="Merchant">Merchant</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === "notifications" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Bell className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">Notification Settings</h3>
                <p className="text-sm text-gray-600">Configure announcements and alerts</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-black text-gray-900">Announcement Banner</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={safeAnnouncementBanner.enabled}
                        onChange={(e) => setFormData({
                          ...formData,
                          announcementBanner: {
                            ...safeAnnouncementBanner,
                            enabled: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Display an announcement banner at the top of the website
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message (English)</label>
                  <input
                    type="text"
                    value={safeAnnouncementBanner.message}
                    onChange={(e) => setFormData({
                      ...formData,
                      announcementBanner: {
                        ...safeAnnouncementBanner,
                        message: e.target.value
                      }
                    })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter announcement message"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message (Bengali)</label>
                  <input
                    type="text"
                    value={safeAnnouncementBanner.messageBn}
                    onChange={(e) => setFormData({
                      ...formData,
                      announcementBanner: {
                        ...safeAnnouncementBanner,
                        messageBn: e.target.value
                      }
                    })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                    placeholder="ঘোষণা বার্তা লিখুন"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Banner Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "info", label: "Info", color: "blue" },
                      { value: "warning", label: "Warning", color: "yellow" },
                      { value: "success", label: "Success", color: "green" }
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setFormData({
                          ...formData,
                          announcementBanner: {
                            ...safeAnnouncementBanner,
                            type: type.value as any
                          }
                        })}
                        className={`px-4 py-3 rounded-xl font-bold transition-all ${
                          safeAnnouncementBanner.type === type.value
                            ? `bg-${type.color}-500 text-white shadow-lg scale-105`
                            : `bg-${type.color}-100 text-${type.color}-700 hover:bg-${type.color}-200`
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Section */}
        {activeSection === "security" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">Security Settings</h3>
                <p className="text-sm text-gray-600">Manage admin access and security</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
              <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} />
                Admin Users
              </h4>
              <div className="space-y-3 mb-4">
                {safeAdminEmails.map((email: string, index: number) => (
                  <div key={email} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-red-300 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{email}</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAdmin(email)}
                      disabled={safeAdminEmails.length === 1}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none"
                />
                <button
                  onClick={handleAddAdmin}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  <Plus size={20} />
                  Add Admin
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock size={24} className="text-blue-600" />
                  <h4 className="text-lg font-black text-gray-900">Two-Factor Auth</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Enable 2FA for enhanced security</p>
                <button className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
                  Enable 2FA
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database size={24} className="text-purple-600" />
                  <h4 className="text-lg font-black text-gray-900">Backup Data</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Create a backup of all data</p>
                <button className="w-full px-4 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all">
                  Create Backup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Section */}
        {activeSection === "appearance" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Palette className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">Appearance Settings</h3>
                <p className="text-sm text-gray-600">Customize site look and feel</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Palette size={24} className="text-pink-600" />
                  <h4 className="text-lg font-black text-gray-900">Primary Color</h4>
                </div>
                <div className="flex gap-3 mb-4">
                  {["#FF3B30", "#007AFF", "#34C759", "#FF9500", "#AF52DE"].map((color) => (
                    <button
                      key={color}
                      className="w-12 h-12 rounded-xl border-4 border-white shadow-lg hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  className="w-full h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                  defaultValue="#FF3B30"
                />
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Image size={24} className="text-blue-600" />
                  <h4 className="text-lg font-black text-gray-900">Site Logo</h4>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Image size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-bold text-gray-600">Click to upload logo</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Monitor size={24} className="text-green-600" />
                  <h4 className="text-lg font-black text-gray-900">Dark Mode</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Enable dark theme for the site</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles size={24} className="text-orange-600" />
                  <h4 className="text-lg font-black text-gray-900">Animations</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Enable smooth animations</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Section */}
        {activeSection === "advanced" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-slate-500 rounded-xl flex items-center justify-center">
                <SettingsIcon className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">Advanced Settings</h3>
                <p className="text-sm text-gray-600">Technical configurations</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Code size={24} className="text-blue-600" />
                    <h4 className="text-lg font-black text-gray-900">API Keys</h4>
                  </div>
                  <button
                    onClick={() => setShowApiKeys(!showApiKeys)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    {showApiKeys ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Supabase API Key</label>
                    <input
                      type={showApiKeys ? "text" : "password"}
                      placeholder="••••••••••••••••"
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Payment Gateway Key</label>
                    <input
                      type={showApiKeys ? "text" : "password"}
                      placeholder="••••••••••••••••"
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Server size={24} className="text-green-600" />
                  <h4 className="text-lg font-black text-gray-900">Cache Settings</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Clear application cache</p>
                <button className="w-full px-4 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all">
                  Clear Cache
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Link size={24} className="text-purple-600" />
                  <h4 className="text-lg font-black text-gray-900">Custom Domain</h4>
                </div>
                <input
                  type="text"
                  placeholder="yourdomain.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none mb-3"
                />
                <button className="w-full px-4 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all">
                  Connect Domain
                </button>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle size={24} className="text-red-600" />
                  <h4 className="text-lg font-black text-gray-900">Danger Zone</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Reset all settings to default</p>
                <button className="w-full px-4 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all">
                  Reset Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className={`${isMobile ? 'fixed bottom-24 left-0 right-0 px-4 z-10' : 'sticky bottom-6 z-10'}`}>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 ${
            isMobile ? 'shadow-2xl' : ''
          }`}
        >
          <Save size={isMobile ? 18 : 24} />
          {saving ? (isMobile ? "সেভ হচ্ছে..." : "Saving...") : (isMobile ? "সেভ করুন" : "Save All Settings")}
          {!saving && <Sparkles size={isMobile ? 16 : 20} />}
        </button>
      </div>
    </div>
  );
}
