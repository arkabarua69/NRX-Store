import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Lock, Bell, Shield, Eye, EyeOff,
  Save, X, Check, AlertCircle, Sparkles, Key,
  Smartphone, Globe, Palette, Moon, Sun, Zap,
  Database, Activity, Award, Star, Heart, Settings as SettingsIcon,
  LogOut, Camera, Upload, Trash2
} from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/ui/Footer";
import { toast } from "sonner";
import { API_URL } from "@/lib/config";

type TabType = "profile" | "security" | "notifications" | "preferences";

export default function Settings() {
  const navigate = useNavigate();
  const { user, userData, updateUserData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Profile Settings
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  // Preference Settings
  const [language, setLanguage] = useState("bn");
  const [theme, setTheme] = useState("light");
  const [currency, setCurrency] = useState("BDT");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
    }
  }, [user, userData, navigate]);

  const handleProfileUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      
      if (updateUserData) {
        updateUserData({ ...userData, name, phone });
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setSaving(true);

    try {
      // API call to update notification preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Notification preferences updated!");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceUpdate = async () => {
    setSaving(true);

    try {
      // API call to update preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Preferences updated!");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("লগআউট সফল হয়েছে! / Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("লগআউট ব্যর্থ হয়েছে / Logout failed");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setUploadingAvatar(true);
    toast.info("Uploading avatar...");

    try {
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;
      
      const IMGBB_API_KEY = "cfdf8c24a5b1249d8b721f1d8adb63a8";
      
      const formData = new FormData();
      formData.append('image', base64Data);
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.data.url) {
        throw new Error("Invalid response from ImgBB");
      }

      const avatarUrl = data.data.url;

      // Update user in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const updatedUser = { ...JSON.parse(storedUser), avatar: avatarUrl };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (updateUserData) {
          updateUserData({ ...userData, avatar: avatarUrl });
        }
      }
      
      toast.success("Avatar updated successfully!");
      window.location.reload(); // Refresh to show new avatar
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!userData) return null;

  const tabs = [
    { id: "profile", label: "Profile", icon: User, color: "blue" },
    { id: "security", label: "Security", icon: Shield, color: "red" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "yellow" },
    { id: "preferences", label: "Preferences", icon: Palette, color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <UnifiedNavbar />

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <SettingsIcon className="text-[#FF3B30]" size={36} />
            সেটিংস
          </h1>
          <p className="text-gray-600 font-medium flex items-center gap-2">
            <Activity size={16} className="text-green-500" />
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-[#FF3B30] to-red-600 text-white shadow-lg shadow-red-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
                    
                    <div className="relative">
                      <h2 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
                        <User size={32} />
                        প্রোফাইল তথ্য / Profile Information
                      </h2>
                      <p className="text-blue-100 text-sm font-bold">আপনার ব্যক্তিগত তথ্য আপডেট করুন</p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-4 border-blue-200">
                      <div className="relative group">
                        {userData?.avatar ? (
                          <img 
                            src={userData.avatar} 
                            alt={userData.name || 'User'}
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center font-black text-4xl sm:text-5xl text-white shadow-2xl ${
                            userData?.avatar ? 'hidden' : ''
                          }`}
                        >
                          {userData?.name?.charAt(0) || 'U'}
                        </div>
                        
                        {/* Upload Overlay */}
                        <label 
                          htmlFor="avatar-upload" 
                          className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Change avatar"
                        >
                          {uploadingAvatar ? (
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Camera size={28} className="text-white mb-1" />
                              <span className="text-white text-xs font-bold">Upload</span>
                            </>
                          )}
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-2xl font-black text-gray-900 mb-1">{userData?.name || 'User'}</h3>
                        <p className="text-gray-600 font-bold mb-3">{userData?.email}</p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                            <Check size={14} />
                            Active Account
                          </span>
                          {userData?.role && (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                              <Star size={14} />
                              {userData.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-black text-gray-900 mb-2 flex items-center gap-2">
                          <User size={16} className="text-blue-600" />
                          পূর্ণ নাম / Full Name *
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all font-medium"
                          placeholder="আপনার নাম লিখুন"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-black text-gray-900 mb-2 flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          ইমেইল ঠিকানা / Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
                        />
                        <p className="text-xs text-gray-500 mt-2 font-bold flex items-center gap-1">
                          <AlertCircle size={12} />
                          ইমেইল পরিবর্তন করা যাবে না / Email cannot be changed
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-black text-gray-900 mb-2 flex items-center gap-2">
                          <Smartphone size={16} className="text-blue-600" />
                          ফোন নম্বর / Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all font-medium"
                          placeholder="আপনার ফোন নম্বর লিখুন"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid sm:grid-cols-2 gap-4 pt-4">
                      <button
                        onClick={handleProfileUpdate}
                        disabled={saving}
                        className="py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white rounded-2xl font-black hover:shadow-2xl hover:shadow-blue-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                      >
                        {saving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            সংরক্ষণ হচ্ছে...
                          </>
                        ) : (
                          <>
                            <Save size={22} />
                            পরিবর্তন সংরক্ষণ করুন
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleLogout}
                        className="py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-black hover:shadow-2xl hover:shadow-red-300 transition-all flex items-center justify-center gap-2 text-base"
                      >
                        <LogOut size={22} />
                        লগআউট / Logout
                      </button>
                    </div>

                    {/* Account Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200 text-center">
                        <Award size={28} className="text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-black text-gray-900">0</p>
                        <p className="text-xs text-gray-600 font-bold">Total Orders</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 text-center">
                        <Heart size={28} className="text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-black text-gray-900">0</p>
                        <p className="text-xs text-gray-600 font-bold">Wishlist</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200 text-center sm:col-span-1 col-span-2">
                        <Star size={28} className="text-yellow-600 mx-auto mb-2" />
                        <p className="text-2xl font-black text-gray-900">0</p>
                        <p className="text-xs text-gray-600 font-bold">Reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div>
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                      <Shield size={28} />
                      Security Settings
                    </h2>
                    <p className="text-red-100 text-sm mt-1">Manage your password and security</p>
                  </div>

                  <div className="p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Current Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#FF3B30] focus:outline-none transition-colors"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#FF3B30] focus:outline-none transition-colors"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#FF3B30] focus:outline-none transition-colors"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={saving}
                      className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-red-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Changing...
                        </>
                      ) : (
                        <>
                          <Key size={20} />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div>
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                      <Bell size={28} />
                      Notification Preferences
                    </h2>
                    <p className="text-yellow-100 text-sm mt-1">Choose what notifications you receive</p>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Mail size={20} className="text-gray-600" />
                        <div>
                          <p className="font-bold text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                      </div>
                      <label className="relative inline-block w-14 h-8">
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-full h-full bg-gray-300 peer-checked:bg-[#FF3B30] rounded-full peer transition-all cursor-pointer"></div>
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Activity size={20} className="text-gray-600" />
                        <div>
                          <p className="font-bold text-gray-900">Order Updates</p>
                          <p className="text-sm text-gray-600">Get notified about order status changes</p>
                        </div>
                      </div>
                      <label className="relative inline-block w-14 h-8">
                        <input
                          type="checkbox"
                          checked={orderUpdates}
                          onChange={(e) => setOrderUpdates(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-full h-full bg-gray-300 peer-checked:bg-[#FF3B30] rounded-full peer transition-all cursor-pointer"></div>
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Star size={20} className="text-gray-600" />
                        <div>
                          <p className="font-bold text-gray-900">Promotions & Offers</p>
                          <p className="text-sm text-gray-600">Receive special offers and promotions</p>
                        </div>
                      </div>
                      <label className="relative inline-block w-14 h-8">
                        <input
                          type="checkbox"
                          checked={promotions}
                          onChange={(e) => setPromotions(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-full h-full bg-gray-300 peer-checked:bg-[#FF3B30] rounded-full peer transition-all cursor-pointer"></div>
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                      </label>
                    </div>

                    <button
                      onClick={handleNotificationUpdate}
                      disabled={saving}
                      className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-yellow-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Preferences
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                      <Palette size={28} />
                      App Preferences
                    </h2>
                    <p className="text-purple-100 text-sm mt-1">Customize your experience</p>
                  </div>

                  <div className="p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Language / ভাষা
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setLanguage("bn")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            language === "bn"
                              ? "border-[#FF3B30] bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <p className="font-bold text-gray-900">বাংলা</p>
                          <p className="text-sm text-gray-600">Bengali</p>
                        </button>
                        <button
                          onClick={() => setLanguage("en")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            language === "en"
                              ? "border-[#FF3B30] bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <p className="font-bold text-gray-900">English</p>
                          <p className="text-sm text-gray-600">English</p>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Theme
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setTheme("light")}
                          className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                            theme === "light"
                              ? "border-[#FF3B30] bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Sun size={24} className="text-yellow-500" />
                          <div className="text-left">
                            <p className="font-bold text-gray-900">Light</p>
                            <p className="text-sm text-gray-600">Default theme</p>
                          </div>
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                            theme === "dark"
                              ? "border-[#FF3B30] bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Moon size={24} className="text-indigo-500" />
                          <div className="text-left">
                            <p className="font-bold text-gray-900">Dark</p>
                            <p className="text-sm text-gray-600">Coming soon</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF3B30] focus:outline-none transition-colors"
                      >
                        <option value="BDT">৳ BDT - Bangladeshi Taka</option>
                        <option value="USD">$ USD - US Dollar</option>
                        <option value="EUR">€ EUR - Euro</option>
                      </select>
                    </div>

                    <button
                      onClick={handlePreferenceUpdate}
                      disabled={saving}
                      className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Preferences
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
