import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function NotificationBellIcon() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE}/notifications/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Polling
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchUnreadCount();

    // Poll every 10 seconds
    const interval = setInterval(fetchUnreadCount, 10000);

    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <div className="relative">
      <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 shadow-sm">
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white text-xs font-black flex items-center justify-center shadow-lg animate-pulse px-1">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );
}
