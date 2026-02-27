import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle } from 'lucide-react';
import MobileLayout from '@/components/mobile-v2/MobileLayout';
import { ModernOrderCard, SearchBar } from '@/components/mobile-v2';
import { getUserOrders, cancelOrder } from '@/lib/orderService';
import { Order } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationCount } from '@/hooks/useNotificationCount';

export default function DashboardMobile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount: notificationCount } = useNotificationCount();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        console.log('❌ No user ID found');
        setOrders([]);
        setLoading(false);
        return;
      }

      console.log('📥 Fetching orders for user:', user.id);
      const data = await getUserOrders(user.id);
      console.log('✅ Orders fetched:', data?.length || 0);
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.warn('⚠️ Unexpected orders response format:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      toast.error('অর্ডার লোড করতে সমস্যা হয়েছে');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.gameId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleOrderClick = (order: Order) => {
    navigate(`/invoice/${order.id}`);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      // Refresh orders after cancellation
      await fetchOrders();
      toast.success('অর্ডার বাতিল করা হয়েছে');
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'অর্ডার বাতিল করতে ব্যর্থ');
      throw error; // Re-throw to let the card component handle it
    }
  };

  const statusFilters = [
    { id: 'all', label: 'সব', icon: Package },
    { id: 'pending', label: 'পেন্ডিং', icon: Clock },
    { id: 'processing', label: 'প্রসেসিং', icon: Clock },
    { id: 'completed', label: 'সম্পন্ন', icon: CheckCircle },
  ];

  return (
    <MobileLayout
      showAppBar={true}
      showNavBar={true}
      appBarProps={{
        showLogo: true,
        showNotification: true,
        notificationCount: notificationCount,
      }}
    >
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="অর্ডার খুঁজুন..."
        showFilter={false}
      />

      {/* Status Filter Chips */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-3">
        {statusFilters.map((filter) => {
          const Icon = filter.icon;
          const isSelected = statusFilter === filter.id;

          return (
            <motion.button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full
                font-bold text-sm whitespace-nowrap
                transition-all duration-200 active:scale-95
                ${isSelected 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border-2 border-gray-200'
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={16} />
              <span>{filter.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="px-4 pb-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-40 rounded-2xl" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">কোন অর্ডার পাওয়া যায়নি</h3>
            <p className="text-sm text-gray-600 mb-6">এখনও কোন অর্ডার করা হয়নি</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/store')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg"
            >
              <Package size={20} />
              <span>এখনই কিনুন</span>
            </motion.button>
          </div>
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order) => (
                <ModernOrderCard
                  key={order.id}
                  order={order}
                  onClick={handleOrderClick}
                  onCancelOrder={handleCancelOrder}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </MobileLayout>
  );
}
