import { Package, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Diamond, Calendar, X } from 'lucide-react';
import { Order } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import CancelOrderModal from '@/components/CancelOrderModal';

interface ModernOrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
  onCancelOrder?: (orderId: string) => void;
}

export default function ModernOrderCard({ order, onClick, onCancelOrder }: ModernOrderCardProps) {
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!onCancelOrder) return;
    
    setCancelling(true);
    try {
      await onCancelOrder(order.id);
      setShowCancelModal(false);
      toast.success('অর্ডার বাতিল করা হয়েছে');
    } catch (error) {
      toast.error('অর্ডার বাতিল করতে ব্যর্থ');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bg: 'from-green-500 to-emerald-500',
          bgLight: 'bg-green-50',
          border: 'border-green-200',
          label: 'সম্পন্ন',
        };
      case 'processing':
        return {
          icon: Clock,
          color: 'text-blue-500',
          bg: 'from-blue-500 to-cyan-500',
          bgLight: 'bg-blue-50',
          border: 'border-blue-200',
          label: 'প্রসেসিং',
        };
      case 'pending':
        return {
          icon: AlertCircle,
          color: 'text-yellow-500',
          bg: 'from-yellow-500 to-orange-500',
          bgLight: 'bg-yellow-50',
          border: 'border-yellow-200',
          label: 'পেন্ডিং',
        };
      case 'cancelled':
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bg: 'from-red-500 to-pink-500',
          bgLight: 'bg-red-50',
          border: 'border-red-200',
          label: 'বাতিল',
        };
      default:
        return {
          icon: Package,
          color: 'text-gray-500',
          bg: 'from-gray-500 to-gray-600',
          bgLight: 'bg-gray-50',
          border: 'border-gray-200',
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onClick(order)}
        className="mobile-card p-4 active:scale-[0.98] transition-transform"
      >
      {/* Header with Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${statusConfig.bg}`}>
              <Package size={14} className="text-white" />
            </div>
            <span className="text-sm font-black text-gray-900">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar size={12} />
            <span className="font-medium">{formatDate(order.createdAt)}</span>
          </div>
        </div>
        
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${statusConfig.bg}`}>
          <StatusIcon size={14} className="text-white" />
          <span className="text-xs font-black text-white">
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className={`${statusConfig.bgLight} rounded-xl p-3 mb-3 border ${statusConfig.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 mb-1.5 truncate">
              {order.productName || 'পণ্য'}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-bold text-gray-600">
                <Diamond size={12} className="text-red-500" />
                <span>{order.diamonds || 0} ডায়মন্ড</span>
              </div>
              {order.gameId && (
                <div className="text-xs text-gray-500">
                  <span className="font-medium">ID:</span>{' '}
                  <span className="font-bold text-gray-700">{order.gameId}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right ml-3">
            <p className="text-lg font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              ৳{order.total_amount || order.price || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-gray-100 rounded-lg">
            <span className="text-xs font-bold text-gray-700">{order.paymentMethod}</span>
          </div>
          
          {/* Cancel Button - Only show for pending orders */}
          {order.status === 'pending' && onCancelOrder && (
            <button
              onClick={handleCancelClick}
              disabled={cancelling}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={14} className="text-red-600" />
              <span className="text-xs font-bold text-red-600">
                বাতিল
              </span>
            </button>
          )}
        </div>
        <button className="flex items-center gap-1 text-sm font-black text-red-500 active:scale-95 transition-transform">
          <span>বিস্তারিত</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        orderNumber={order.id.slice(0, 8).toUpperCase()}
        loading={cancelling}
      />
    </>
  );
}
