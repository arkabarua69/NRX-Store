import { X, Bell, Check, Trash2, Package, AlertCircle, CheckCircle, Info, ExternalLink } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";
import { useEffect, useRef } from "react";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
      onClose();
    } else if (notification.orderId) {
      navigate(`/dashboard`);
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
        return <Package className="text-blue-500" size={20} />;
      default:
        return <Info className="text-gray-500" size={20} />;
    }
  };

  // Show max 10 notifications
  const displayNotifications = notifications.slice(0, 10);
  const hasMore = notifications.length > 10;

  return (
    <div
      ref={panelRef}
      className="fixed right-4 top-20 w-[95vw] sm:w-[420px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 flex flex-col animate-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-4 text-white rounded-t-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black">নোটিফিকেশন</h2>
              <p className="text-xs text-white/90 font-bold">
                {unreadCount} টি নতুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="flex-1 py-1.5 px-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Check size={14} />
              সব পড়া হয়েছে
            </button>
            <button
              onClick={clearAll}
              className="flex-1 py-1.5 px-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Trash2 size={14} />
              সব মুছুন
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[60vh]">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell size={32} className="text-purple-400" />
            </div>
            <p className="text-gray-600 font-bold text-sm mb-1">কোনো নোটিফিকেশন নেই</p>
            <p className="text-gray-500 text-xs">আপনার সব নোটিফিকেশন এখানে দেখাবে</p>
          </div>
        ) : (
          <>
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                  notification.read
                    ? "bg-gray-50 border-gray-200 hover:border-gray-300"
                    : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300"
                }`}
              >
                <div className="flex gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-black text-xs ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0 mt-1 animate-pulse" />
                      )}
                    </div>
                    
                    <p className={`text-xs mb-1.5 ${notification.read ? "text-gray-500" : "text-gray-700"} font-medium line-clamp-2`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-bold">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: bn })}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 hover:bg-red-100 rounded transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={12} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {hasMore && (
              <button
                onClick={() => {
                  navigate('/dashboard');
                  onClose();
                }}
                className="w-full py-2 px-3 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-xl transition-all font-bold text-xs text-purple-700 flex items-center justify-center gap-2"
              >
                সব দেখুন ({notifications.length})
                <ExternalLink size={14} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
