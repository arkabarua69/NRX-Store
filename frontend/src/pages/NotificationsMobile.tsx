import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Package, CheckCircle, AlertCircle, Info, 
  Trash2, Check, Filter, Clock, Gift
} from 'lucide-react';
import MobileLayout from '@/components/mobile-v2/MobileLayout';
import { notificationService, Notification } from '@/lib/notificationService';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type NotificationFilter = 'all' | 'unread' | 'orders' | 'system';

export default function NotificationsMobile() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications({ limit: 100 });
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('নোটিফিকেশন লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('সব নোটিফিকেশন পড়া হয়েছে');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('সমস্যা হয়েছে');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('মুছতে সমস্যা হয়েছে');
    }
  };

  const clearAll = async () => {
    try {
      await notificationService.clearAll();
      setNotifications([]);
      toast.success('সব নোটিফিকেশন মুছে ফেলা হয়েছে');
    } catch (error) {
      console.error('Error clearing all:', error);
      toast.error('সমস্যা হয়েছে');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return Package;
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Info;
      case 'promotion':
        return Gift;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'from-blue-500 to-cyan-500';
      case 'success':
        return 'from-green-500 to-emerald-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      case 'info':
        return 'from-purple-500 to-pink-500';
      case 'promotion':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.is_read;
    if (filter === 'orders') return notif.type === 'order' || notif.type === 'success';
    if (filter === 'system') return notif.type === 'info' || notif.type === 'warning' || notif.type === 'system';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (selectionMode) {
      toggleSelection(notification.id);
    } else {
      if (!notification.is_read) {
        markAsRead(notification.id);
      }
      if (notification.metadata?.link) {
        navigate(notification.metadata.link);
      } else if (notification.related_order_id) {
        navigate('/dashboard');
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleMarkSelectedAsRead = () => {
    selectedIds.forEach(id => markAsRead(id));
    setSelectedIds([]);
    setSelectionMode(false);
    toast.success('নোটিফিকেশন পড়া হয়েছে');
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`${selectedIds.length}টি নোটিফিকেশন মুছে ফেলবেন?`)) {
      selectedIds.forEach(id => deleteNotification(id));
      setSelectedIds([]);
      setSelectionMode(false);
      toast.success('নোটিফিকেশন মুছে ফেলা হয়েছে');
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success('সব নোটিফিকেশন পড়া হয়েছে');
  };

  const handleClearAll = () => {
    if (window.confirm('সব নোটিফিকেশন মুছে ফেলবেন?')) {
      clearAll();
      toast.success('সব নোটিফিকেশন মুছে ফেলা হয়েছে');
    }
  };

  const filters = [
    { id: 'all', label: 'সব', count: notifications.length },
    { id: 'unread', label: 'না পড়া', count: unreadCount },
    { id: 'orders', label: 'অর্ডার', count: notifications.filter(n => n.type === 'order' || n.type === 'success').length },
    { id: 'system', label: 'সিস্টেম', count: notifications.filter(n => n.type === 'info' || n.type === 'warning' || n.type === 'system').length },
  ];

  if (loading) {
    return (
      <MobileLayout
        showAppBar={true}
        showNavBar={true}
        appBarProps={{
          title: 'নোটিফিকেশন',
          showBack: true,
        }}
      >
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      showAppBar={true}
      showNavBar={true}
      appBarProps={{
        title: 'নোটিফিকেশন',
        subtitle: unreadCount > 0 ? `${unreadCount}টি নতুন` : 'সব পড়া হয়েছে',
        showBack: true,
        rightActions: notifications.length > 0 ? (
          <div className="flex items-center gap-1">
            {selectionMode ? (
              <>
                {selectedIds.length > 0 && (
                  <>
                    <button
                      onClick={handleMarkSelectedAsRead}
                      className="p-2 rounded-xl text-green-500 active:bg-green-50 transition-colors"
                    >
                      <Check size={22} />
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      className="p-2 rounded-xl text-red-500 active:bg-red-50 transition-colors"
                    >
                      <Trash2 size={22} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setSelectionMode(false);
                    setSelectedIds([]);
                  }}
                  className="p-2 rounded-xl text-gray-500 active:bg-gray-100 transition-colors"
                >
                  বাতিল
                </button>
              </>
            ) : (
              <>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="p-2 rounded-xl text-green-500 active:bg-green-50 transition-colors"
                  >
                    <Check size={22} />
                  </button>
                )}
                <button
                  onClick={() => setSelectionMode(true)}
                  className="p-2 rounded-xl text-gray-700 active:bg-gray-100 transition-colors"
                >
                  <Filter size={22} />
                </button>
              </>
            )}
          </div>
        ) : undefined,
      }}
    >
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Bell size={60} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">কোন নোটিফিকেশন নেই</h2>
          <p className="text-gray-600 text-center">
            আপনার কোন নতুন নোটিফিকেশন নেই
          </p>
        </div>
      ) : (
        <>
          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-3">
            {filters.map((f) => {
              const isSelected = filter === f.id;
              return (
                <motion.button
                  key={f.id}
                  onClick={() => setFilter(f.id as NotificationFilter)}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full
                    font-bold text-sm whitespace-nowrap
                    transition-all duration-200
                    ${isSelected 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                      : 'bg-white text-gray-700 border-2 border-gray-200'
                    }
                  `}
                >
                  <span>{f.label}</span>
                  {f.count > 0 && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-black
                      ${isSelected ? 'bg-white/20' : 'bg-gray-100'}
                    `}>
                      {f.count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Notifications List */}
          <div className="px-4 pb-6 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Info size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">এই ফিল্টারে কোন নোটিফিকেশন নেই</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const gradient = getNotificationColor(notification.type);
                  const isSelected = selectedIds.includes(notification.id);

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`
                        mobile-card p-4 cursor-pointer relative
                        ${!notification.is_read ? 'border-l-4 border-red-500' : ''}
                        ${isSelected ? 'ring-2 ring-red-500' : ''}
                      `}
                    >
                      {/* Selection Checkbox */}
                      {selectionMode && (
                        <div className="absolute top-4 right-4">
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center
                            ${isSelected 
                              ? 'bg-red-500 border-red-500' 
                              : 'border-gray-300 bg-white'
                            }
                          `}>
                            {isSelected && <Check size={14} className="text-white" />}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`
                          w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} 
                          flex items-center justify-center flex-shrink-0 shadow-lg
                        `}>
                          <Icon size={24} className="text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-8">
                          <h3 className={`
                            font-bold text-gray-900 text-sm mb-1 line-clamp-2
                            ${!notification.is_read ? 'font-black' : ''}
                          `}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>{new Date(notification.created_at).toLocaleDateString('bn-BD')}</span>
                            {!notification.is_read && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-bold">
                                নতুন
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delete Button (when not in selection mode) */}
                      {!selectionMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('এই নোটিফিকেশন মুছে ফেলবেন?')) {
                              deleteNotification(notification.id);
                              toast.success('নোটিফিকেশন মুছে ফেলা হয়েছে');
                            }
                          }}
                          className="absolute bottom-4 right-4 p-2 rounded-lg text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Clear All Button */}
          {notifications.length > 0 && !selectionMode && (
            <div className="px-4 pb-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleClearAll}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 px-6 py-3 rounded-xl font-bold border-2 border-red-200 active:bg-red-100 transition-colors"
              >
                <Trash2 size={20} />
                <span>সব মুছে ফেলুন</span>
              </motion.button>
            </div>
          )}
        </>
      )}
    </MobileLayout>
  );
}
