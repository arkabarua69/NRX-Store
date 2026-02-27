import { useState, useEffect, useRef } from "react";
import { X, Bell, Check, Trash2, Package, CreditCard, MessageCircle, AlertCircle, CheckCircle, XCircle, Clock, Search, Calendar } from "lucide-react";
import { notificationService, Notification } from "@/lib/notificationService";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

interface UserNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserNotificationPanel({ isOpen, onClose }: UserNotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      // Real-time polling every 5 seconds
      const interval = setInterval(loadNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, filter]);

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

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications({
        unread_only: filter === 'unread',
        limit: 50,
      });
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await notificationService.markAllAsRead();
      toast.success('সব নোটিফিকেশন পড়া হয়েছে');
      loadNotifications();
    } catch (error) {
      toast.error('Failed to mark all as read');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      toast.success('নোটিফিকেশন মুছে ফেলা হয়েছে');
      loadNotifications();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('সব নোটিফিকেশন মুছে ফেলবেন?')) return;
    
    setLoading(true);
    try {
      await notificationService.clearAll();
      toast.success('সব নোটিফিকেশন মুছে ফেলা হয়েছে');
      loadNotifications();
    } catch (error) {
      toast.error('Failed to clear all');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order_placed': return <Package className="text-blue-500" size={20} />;
      case 'order_verified': return <CheckCircle className="text-green-500" size={20} />;
      case 'order_cancelled': return <XCircle className="text-red-500" size={20} />;
      case 'order_completed': return <CheckCircle className="text-emerald-500" size={20} />;
      case 'payment_pending': return <CreditCard className="text-yellow-500" size={20} />;
      case 'support_reply': return <MessageCircle className="text-purple-500" size={20} />;
      case 'order_processing': return <Clock className="text-cyan-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order_placed': return 'from-blue-500 to-indigo-500';
      case 'order_verified': return 'from-green-500 to-emerald-500';
      case 'order_cancelled': return 'from-red-500 to-rose-500';
      case 'order_completed': return 'from-emerald-500 to-teal-500';
      case 'payment_pending': return 'from-yellow-500 to-orange-500';
      case 'support_reply': return 'from-purple-500 to-pink-500';
      case 'order_processing': return 'from-cyan-500 to-blue-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Filter notifications by search
  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter = filter === 'all' || !notification.is_read;
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!isOpen) return null;

  if (loading) {
    return (
      <div ref={panelRef} className="fixed right-4 top-20 w-[95vw] sm:w-[500px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 flex flex-col z-50">
        <div className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className="fixed right-4 top-20 w-[95vw] sm:w-[500px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 flex flex-col z-50 animate-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 text-white rounded-t-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Bell size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black">নোটিফিকেশন</h2>
              <p className="text-xs text-white/80 font-semibold">
                {unreadCount} নতুন • {notifications.length} মোট
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
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filter === 'all'
                ? "bg-white text-slate-900"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            সব
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              filter === 'all'
                ? "bg-slate-900 text-white"
                : "bg-white/20"
            }`}>
              {notifications.length}
            </span>
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filter === 'unread'
                ? "bg-white text-slate-900"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            নতুন
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              filter === 'unread'
                ? "bg-slate-900 text-white"
                : "bg-white/20"
            }`}>
              {unreadCount}
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleMarkAllAsRead}
              disabled={loading || unreadCount === 0}
              className="flex-1 py-2 px-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={14} />
              সব পড়া হয়েছে
            </button>
            <button
              onClick={handleClearAll}
              disabled={loading || notifications.length === 0}
              className="flex-1 py-2 px-3 bg-red-500/20 backdrop-blur-sm rounded-lg hover:bg-red-500/30 transition-all font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={14} />
              সব মুছে ফেলুন
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
              {searchTerm || filter === 'unread' ? "কোনো মিল পাওয়া যায়নি" : "কোনো নোটিফিকেশন নেই"}
            </p>
            <p className="text-gray-500 text-sm">
              {searchTerm || filter === 'unread' ? "Try adjusting your filters" : "All notifications will appear here"}
            </p>
          </div>
        ) : (
          <>
            {filteredNotifications.map((notification, index) => (
              <div
                key={`${notification.id}-${index}`}
                className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group overflow-hidden ${
                  notification.is_read
                    ? "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                    : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300 hover:shadow-lg"
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
                      
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="p-1.5 hover:bg-green-100 rounded-lg transition-all"
                            title="Mark as read"
                          >
                            <Check size={14} className="text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
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
              <div className="text-xs text-gray-500 font-semibold">মোট</div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-lg font-black text-purple-600">{unreadCount}</div>
              <div className="text-xs text-gray-500 font-semibold">নতুন</div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-lg font-black text-green-600">{notifications.filter(n => n.is_read).length}</div>
              <div className="text-xs text-gray-500 font-semibold">পড়া</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
