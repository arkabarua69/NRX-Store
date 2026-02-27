import { useState } from "react";
import { Bell, Send, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminNotifications() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "info" as "info" | "success" | "warning" | "error",
    title: "",
    titleBn: "",
    message: "",
    messageBn: "",
    link: "",
    priority: "normal" as "low" | "normal" | "high" | "urgent",
  });

  const notificationTypes = [
    { value: "info", label: "Info", icon: Info, color: "blue" },
    { value: "success", label: "Success", icon: CheckCircle, color: "green" },
    { value: "warning", label: "Warning", icon: AlertTriangle, color: "yellow" },
    { value: "error", label: "Error", icon: AlertCircle, color: "red" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "gray" },
    { value: "normal", label: "Normal", color: "blue" },
    { value: "high", label: "High", color: "orange" },
    { value: "urgent", label: "Urgent", color: "red" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.titleBn || !formData.message || !formData.messageBn) {
      toast.error("সব ফিল্ড পূরণ করুন!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/notifications/admin/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create notification");
      }

      const result = await response.json();
      console.log("Admin notification created:", result);

      toast.success("নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!");

      // Reset form
      setFormData({
        type: "info",
        title: "",
        titleBn: "",
        message: "",
        messageBn: "",
        link: "",
        priority: "normal",
      });
    } catch (error: any) {
      console.error("Error creating admin notification:", error);
      toast.error(error.message || "নোটিফিকেশন পাঠাতে ব্যর্থ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Admin Notifications</h1>
              <p className="text-sm text-gray-600">সব ইউজারকে নোটিফিকেশন পাঠান</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-3">
              Notification Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {notificationTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value as any })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `border-${type.color}-500 bg-${type.color}-50`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mx-auto mb-2 ${
                        isSelected ? `text-${type.color}-600` : "text-gray-400"
                      }`}
                    />
                    <span className="text-xs font-bold">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-3">
              Priority
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {priorities.map((priority) => {
                const isSelected = formData.priority === priority.value;
                return (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: priority.value as any })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `border-${priority.color}-500 bg-${priority.color}-50`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-sm font-bold">{priority.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title (English) */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">
              Title (English)
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. System Maintenance"
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Title (Bangla) */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">
              Title (বাংলা)
            </label>
            <input
              type="text"
              required
              value={formData.titleBn}
              onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
              placeholder="যেমন: সিস্টেম মেইনটেনেন্স"
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Message (English) */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">
              Message (English)
            </label>
            <textarea
              required
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="e.g. System will be under maintenance from 2 AM to 4 AM"
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* Message (Bangla) */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">
              Message (বাংলা)
            </label>
            <textarea
              required
              rows={3}
              value={formData.messageBn}
              onChange={(e) => setFormData({ ...formData, messageBn: e.target.value })}
              placeholder="যেমন: সিস্টেম রাত ২টা থেকে ৪টা পর্যন্ত মেইনটেনেন্সে থাকবে"
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* Link (Optional) */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">
              Link (Optional)
            </label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="e.g. /store or https://example.com"
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              ইউজার ক্লিক করলে এই লিংকে যাবে (optional)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              "পাঠানো হচ্ছে..."
            ) : (
              <>
                <Send size={20} />
                সব ইউজারকে পাঠান
              </>
            )}
          </button>

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-bold mb-1">গুরুত্বপূর্ণ:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>এই নোটিফিকেশন সব ইউজার দেখতে পারবে</li>
                  <li>Real-time এ সবার কাছে পৌঁছাবে</li>
                  <li>Navbar এর notification bell এ দেখাবে</li>
                  <li>Toast notification হিসেবেও দেখাবে</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
