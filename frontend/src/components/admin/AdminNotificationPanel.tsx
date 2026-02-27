import { X, Bell, Check, Trash2, Package, AlertCircle, CheckCircle, Info, Search, Calendar, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { adminNotificationsAPI } from "@/lib/api";

interface AdminNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  embedded?: boolean;
  onCountChange?: (count: number) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  is_important: boolean;
  priority: string;
  created_at: string;
  related_order_id?: string;
  metadata?: any;
}

export default function AdminNotificationPanel({ isOpen, onClose, embedded = false, onCountChange }: AdminNotificationPanelProps) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await adminNotificationsAPI.getAll({ limit: 100 });
      if (response.data) {
        setNotifications(response.data);
        const unread = response.data.filter((n: Notification) => !n.is_read).length;
        setUnreadCount(unread);
        if (onCountChange) {
          onCountChange(unread);
        }
      }
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when panel opens
  useEffect(() => {
    if (isOpen || embedded) {
      fetchNotifications();
    }
  }, [isOpen, embedded]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await adminNotificationsAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (onCountChange) {
        onCountChange(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await adminNotificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      if (onCountChange) {
        onCountChange(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await adminNotificationsAPI.delete(notificationId);
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
        if (onCountChange) {
          onCountChange(Math.max(0, unreadCount - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    try {
      await adminNotificationsAPI.clearAll();
      setNotifications([]);
      setUnreadCount(0);
      if (onCountChange) {
        onCountChange(0);
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  // Click outside to close (only for non-embedded mode)
  useEffect(() => {
    if (embedded) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, embedded]);

  if (!isOpen && !embedded) return null;

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Check metadata for link
    const link = notification.metadata?.link;
    if (link) {
      navigate(link);
      onClose();
    } else if (notification.related_order_id) {
      navigate(`/admin-dashboard`);
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      case "error":
        return <AlertCircle className="text-red-500" size={20} />;
      case "warning":
        return <AlertCircle className="text-yellow-500" size={20} />;
      case "order":
        return <ShoppingCart className="text-blue-500" size={20} />;
      default:
        return <Info className="text-gray-500" size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "from-green-500 to-emerald-500";
      case "error":
        return "from-red-500 to-rose-500";
      case "warning":
        return "from-yellow-500 to-orange-500";
      case "order":
        return "from-blue-500 to-indigo-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filterOptions = [
    { value: "all", label: "All", count: notifications.length },
    { value: "order", label: "Orders", count: notifications.filter(n => n.type === "order").length },
    { value: "system", label: "System", count: notifications.filter(n => n.type === "system").length },
    { value: "support", label: "Support", count: notifications.filter(n => n.type === "support").length },
  ];

  if (loading) {
    return (
      <div
        ref={panelRef}
        className={embedded 
          ? "w-full bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col"
          : "fixed right-4 top-20 w-[95vw] sm:w-[500px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 flex flex-col"
        }
      >
        <div className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#FF3B30]/20 border-t-[#FF3B30] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className={embedded 
        ? "w-full bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col"
        : "fixed right-4 top-20 w-[95vw] sm:w-[500px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 flex flex-col animate-in slide-in-from-top-2 duration-200"
      }
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 text-white rounded-t-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF3B30] to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bell size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black">Admin Notifications</h2>
              <p className="text-xs text-white/80 font-semibold">
                {unreadCount} unread • {notifications.length} total
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={22} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterType(option.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                filterType === option.value
                  ? "bg-white text-slate-900"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {option.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                filterType === option.value
                  ? "bg-slate-900 text-white"
                  : "bg-white/20"
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={markAllAsRead}
              className="flex-1 py-2 px-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all font-bold text-xs flex items-center justify-center gap-2"
            >
              <Check size={14} />
              Mark All Read
            </button>
            <button
              onClick={clearAll}
              className="flex-1 py-2 px-3 bg-red-500/20 backdrop-blur-sm rounded-lg hover:bg-red-500/30 transition-all font-bold text-xs flex items-center justify-center gap-2"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(85vh-280px)]">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell size={36} className="text-gray-400" />
            </div>
            <p className="text-gray-900 font-bold text-base mb-1">
              {searchTerm || filterType !== "all" ? "No matching notifications" : "No notifications yet"}
            </p>
            <p className="text-gray-500 text-sm">
              {searchTerm || filterType !== "all" ? "Try adjusting your filters" : "All system notifications will appear here"}
            </p>
          </div>
        ) : (
          <>
            {filteredNotifications.map((notification, index) => (
              <div
                key={`${notification.id}-${index}`}
                onClick={() => handleNotificationClick(notification)}
                className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group overflow-hidden ${
                  notification.is_read
                    ? "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                    : "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300 hover:shadow-lg"
                }`}
              >
                {/* Gradient accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getTypeColor(notification.type)}`} />
                
                <div className="flex gap-3 ml-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      notification.is_read ? "bg-gray-100" : "bg-white shadow-sm"
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-black text-sm ${notification.is_read ? "text-gray-700" : "text-gray-900"}`}>
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex-shrink-0 mt-1.5 animate-pulse shadow-lg shadow-red-500/50" />
                      )}
                    </div>
                    
                    <p className={`text-sm mb-2 ${notification.is_read ? "text-gray-500" : "text-gray-700"} font-medium`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1 font-semibold">
                          <Calendar size={12} />
                          {format(new Date(notification.created_at), "MMM dd, HH:mm")}
                        </span>
                        <span className="font-bold">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>

                    {/* Order ID Badge */}
                    {notification.related_order_id && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                        <Package size={12} />
                        Order: {notification.related_order_id.slice(0, 8)}
                      </div>
                    )}

                    {/* Priority Badge */}
                    {notification.is_important && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold ml-2">
                        <AlertCircle size={12} />
                        Important
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer Stats */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-lg font-black text-gray-900">{notifications.length}</div>
              <div className="text-xs text-gray-500 font-semibold">Total</div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-lg font-black text-blue-600">{unreadCount}</div>
              <div className="text-xs text-gray-500 font-semibold">Unread</div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-lg font-black text-green-600">{notifications.filter(n => n.is_read).length}</div>
              <div className="text-xs text-gray-500 font-semibold">Read</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
