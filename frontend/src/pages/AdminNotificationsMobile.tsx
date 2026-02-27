import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, CheckCircle, AlertCircle, Info, 
  Trash2, Check, ShoppingCart, Clock, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { adminNotificationsAPI } from '@/lib/api';

type NotificationFilter = 'all' | 'unread' | 'orders' | 'system';

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

export default function AdminNotificationsMobile() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<NotificationFilter>('all');

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await adminNotificationsAPI.getAll({ limit: 100 });
      if (response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Safe date formatter
  const formatNotificationTime = (notification: Notification) => {
    try {
      const dateStr = notification.created_at;
      if (!dateStr) return 'Just now';
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Just now';
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Just now';
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await adminNotificationsAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await adminNotificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await adminNotificationsAPI.delete(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      try {
        await adminNotificationsAPI.clearAll();
        setNotifications([]);
        toast.success('All notifications cleared');
      } catch (error) {
        console.error('Error clearing all notifications:', error);
        toast.error('Failed to clear notifications');
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return ShoppingCart;
      case 'success':
        return CheckCircle;
      case 'error':
      case 'warning':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'from-blue-500 to-cyan-500';
      case 'success':
        return 'from-green-500 to-emerald-500';
      case 'error':
        return 'from-red-500 to-pink-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.is_read;
    if (filter === 'orders') return notif.type === 'order';
    if (filter === 'system') return notif.type === 'system' || notif.type === 'support';
    return true;
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    const link = notification.metadata?.link;
    if (link) {
      navigate(link);
    } else if (notification.related_order_id) {
      navigate('/admin-dashboard');
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAll();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white sticky top-0 z-10 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors active:scale-95"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-black flex items-center gap-2">
                <Bell size={24} />
                Admin Notifications
              </h1>
              <p className="text-sm text-white/80 font-medium">
                {unreadCount} unread • {notifications.length} total
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { value: 'all', label: 'All', count: notifications.length },
              { value: 'unread', label: 'Unread', count: unreadCount },
              { value: 'orders', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
              { value: 'system', label: 'System', count: notifications.filter(n => n.type === 'system' || n.type === 'support').length },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value as NotificationFilter)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  filter === tab.value
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  filter === tab.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/20'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          {notifications.length > 0 && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleMarkAllAsRead}
                className="flex-1 py-2.5 px-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all font-bold text-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <Check size={16} />
                Mark All Read
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2.5 px-4 bg-red-500/30 backdrop-blur-sm rounded-xl hover:bg-red-500/40 transition-all font-bold text-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3 pb-24">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Bell size={48} className="text-gray-400" />
            </div>
            <p className="text-gray-900 font-black text-lg mb-2">
              {filter !== 'all' ? 'No matching notifications' : 'No notifications yet'}
            </p>
            <p className="text-gray-500 text-sm">
              {filter !== 'all' ? 'Try adjusting your filters' : 'All admin notifications will appear here'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              const colorGradient = getNotificationColor(notification.type);

              return (
                <motion.div
                  key={`notif-${notification.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`bg-white rounded-2xl p-4 shadow-md border-2 transition-all active:scale-[0.98] ${
                    notification.is_read
                      ? 'border-gray-100'
                      : 'border-purple-200 shadow-lg shadow-purple-100'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorGradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon size={24} className="text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-black text-gray-900 text-sm leading-tight">
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{formatNotificationTime(notification)}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500 active:scale-95"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
