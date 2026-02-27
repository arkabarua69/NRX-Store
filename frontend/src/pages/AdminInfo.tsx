import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, Mail, User, Calendar, Clock, Activity, TrendingUp, 
  LayoutDashboard, Settings, Lock, CheckCircle, AlertCircle,
  ArrowLeft, Sparkles, Star, Zap, Database, Globe, FileText,
  Award, Target, Briefcase, Code, Terminal, Cpu
} from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/lib/config";
import { format } from "date-fns";

export default function AdminInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const adminUserStr = localStorage.getItem("adminUser");

    if (!adminToken || !adminUserStr) {
      toast.error("দয়া করে প্রথমে লগইন করুন");
      navigate("/admin");
      return;
    }

    const user = JSON.parse(adminUserStr);
    setAdminUser(user);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-[#FF3B30]/20 border-t-[#FF3B30] rounded-full animate-spin mx-auto mb-6" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FF3B30] animate-pulse" size={32} />
          </div>
          <p className="text-white font-bold text-xl mb-2">Loading Admin Info...</p>
          <p className="text-gray-400 text-sm">Please wait</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  const features = [
    { icon: Database, label: "Database Management", color: "blue" },
    { icon: Globe, label: "Website Control", color: "green" },
    { icon: FileText, label: "Content Management", color: "purple" },
    { icon: Settings, label: "System Settings", color: "orange" },
    { icon: Terminal, label: "API Access", color: "pink" },
    { icon: Cpu, label: "Performance Monitor", color: "cyan" },
  ];

  const stats = [
    { label: "Role", value: adminUser.role, icon: Award, color: "from-yellow-500 to-orange-500" },
    { label: "Status", value: "Active", icon: Zap, color: "from-green-500 to-emerald-500" },
    { label: "Access Level", value: "Full", icon: Shield, color: "from-red-500 to-pink-500" },
    { label: "Permissions", value: "All", icon: CheckCircle, color: "from-blue-500 to-cyan-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF3B30]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="flex items-center gap-2 text-white hover:text-[#FF3B30] transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-semibold">Back to Dashboard</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                  <p className="text-xs text-gray-400">Logged in as</p>
                  <p className="text-sm font-bold text-white">{adminUser.username}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#FF3B30] to-red-600 rounded-3xl mb-6 shadow-2xl shadow-red-500/50 relative">
              <Shield className="text-white" size={48} />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star size={16} className="text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
              <Sparkles className="text-[#FF3B30]" size={40} />
              Admin Profile
            </h1>
            <p className="text-xl text-gray-400 font-medium">
              Complete administrator account information
            </p>
          </div>

          {/* Main Profile Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden mb-8 shadow-2xl">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#FF3B30] via-red-500 to-red-600 p-8">
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-4xl font-black border-4 border-white/30">
                  {adminUser.fullName?.charAt(0) || 'A'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-4xl font-black text-white">{adminUser.fullName}</h2>
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold text-white flex items-center gap-2 border border-white/30">
                      <Star size={16} />
                      {adminUser.role}
                    </span>
                  </div>
                  <p className="text-white/90 font-semibold flex items-center gap-2 text-lg mb-2">
                    <Mail size={20} />
                    {adminUser.email}
                  </p>
                  <p className="text-white/80 font-medium flex items-center gap-2">
                    <User size={18} />
                    @{adminUser.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-8">
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                        <stat.icon size={24} className="text-white" />
                      </div>
                      <p className="text-sm font-semibold text-gray-400 uppercase mb-1">{stat.label}</p>
                      <p className="text-2xl font-black text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Account Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Lock className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-blue-400 uppercase mb-2">User ID</p>
                      <p className="text-sm font-mono font-bold text-white break-all bg-white/5 px-3 py-2 rounded-lg">
                        {adminUser.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Clock className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-green-400 uppercase mb-2">Current Session</p>
                      <p className="text-lg font-black text-white">Active Now</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(), "MMM dd, yyyy • hh:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-8">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <Briefcase className="text-[#FF3B30]" size={28} />
              Admin Capabilities
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon size={24} className="text-white" />
                    </div>
                    <p className="font-bold text-white">{feature.label}</p>
                    <p className="text-sm text-gray-400 mt-1">Full access granted</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="group relative overflow-hidden bg-gradient-to-r from-[#FF3B30] to-red-600 rounded-2xl p-6 hover:shadow-2xl hover:shadow-red-500/50 transition-all"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={24} className="text-white" />
                  <span className="font-bold text-white text-lg">Dashboard</span>
                </div>
                <TrendingUp size={20} className="text-white" />
              </div>
            </button>

            <button
              onClick={() => navigate("/")}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={24} className="text-white" />
                  <span className="font-bold text-white text-lg">Website</span>
                </div>
                <TrendingUp size={20} className="text-gray-400" />
              </div>
            </button>

            <button
              onClick={() => navigate("/store")}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target size={24} className="text-white" />
                  <span className="font-bold text-white text-lg">Store</span>
                </div>
                <TrendingUp size={20} className="text-gray-400" />
              </div>
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-yellow-400 flex-shrink-0" size={24} />
              <div>
                <p className="font-bold text-yellow-300 mb-2">Security Notice</p>
                <p className="text-sm text-yellow-200/80">
                  You have full administrative access to this system. Please use your privileges responsibly and ensure all actions are logged and monitored.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
