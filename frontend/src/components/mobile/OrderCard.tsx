import { Package, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Diamond } from 'lucide-react';
import { Order } from '@/lib/types';

interface OrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bg: 'bg-green-50',
          border: 'border-green-200',
          label: 'সম্পন্ন',
        };
      case 'processing':
        return {
          icon: Clock,
          color: 'text-blue-500',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          label: 'প্রসেসিং',
        };
      case 'pending':
        return {
          icon: AlertCircle,
          color: 'text-yellow-500',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          label: 'পেন্ডিং',
        };
      case 'cancelled':
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bg: 'bg-red-50',
          border: 'border-red-200',
          label: 'বাতিল',
        };
      default:
        return {
          icon: Package,
          color: 'text-gray-500',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      onClick={() => onClick(order)}
      className="mobile-card p-4 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Package size={16} className="text-gray-600" />
            <span className="text-sm font-bold text-gray-900">
              অর্ডার #{order.id.slice(0, 8)}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.border} border`}>
          <StatusIcon size={14} className={statusConfig.color} />
          <span className={`text-xs font-bold ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-gray-50 rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900 mb-1">
              {order.productName || 'পণ্য'}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Diamond size={12} className="text-red-500" />
                {order.diamonds || 0} ডায়মন্ড
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-red-500">
              ৳{order.total_amount || order.price || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Game Info */}
      {order.gameId && (
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
          <span className="font-medium">গেম আইডি:</span>
          <span className="font-bold text-gray-900">{order.gameId}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>{order.paymentMethod}</span>
        </div>
        <button className="flex items-center gap-1 text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
          <span>বিস্তারিত</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
