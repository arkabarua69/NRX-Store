import { motion } from 'framer-motion';
import { Package, Diamond, User, CreditCard, Calendar, Eye, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import { Order } from '@/lib/types';
import { format } from 'date-fns';

interface MobileOrderCardProps {
  order: Order;
  onShowProof: (order: Order) => void;
  onShowActions: (orderId: string) => void;
}

export default function MobileOrderCard({ order, onShowProof, onShowActions }: MobileOrderCardProps) {
  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'from-green-500 to-emerald-500', label: 'সম্পন্ন' };
      case 'processing':
        return { icon: Clock, color: 'text-blue-500', bg: 'from-blue-500 to-cyan-500', label: 'প্রসেসিং' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-500', bg: 'from-yellow-500 to-orange-500', label: 'পেন্ডিং' };
      case 'failed':
        return { icon: XCircle, color: 'text-red-500', bg: 'from-red-500 to-pink-500', label: 'ব্যর্থ' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-gray-500', bg: 'from-gray-500 to-gray-600', label: 'বাতিল' };
      default:
        return { icon: Package, color: 'text-gray-500', bg: 'from-gray-500 to-gray-600', label: status };
    }
  };

  const getVerificationConfig = (status: Order["verificationStatus"]) => {
    switch (status) {
      case 'verified':
        return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'ভেরিফাইড' };
      case 'rejected':
        return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'রিজেক্টেড' };
      case 'pending':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'পেন্ডিং' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', label: 'পেন্ডিং' };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const verificationConfig = getVerificationConfig(order.verification_status || order.verificationStatus || 'pending');
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 active:scale-[0.98] transition-transform"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl bg-gradient-to-r ${statusConfig.bg}`}>
            <Package size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Calendar size={10} />
              <span>{format(new Date(order.createdAt || order.created_at), 'dd MMM, HH:mm')}</span>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r ${statusConfig.bg}`}>
          <StatusIcon size={12} className="text-white" />
          <span className="text-[10px] font-black text-white">{statusConfig.label}</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 mb-3 border border-purple-100">
        <p className="text-sm font-black text-gray-900 mb-2">{order.productName || order.product_name || 'Unknown Product'}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Diamond size={12} className="text-red-500" />
              <span className="text-xs font-bold text-gray-700">{order.diamonds || 0}</span>
            </div>
            <div className="text-xs text-gray-600">
              <span className="font-medium">ID:</span> <span className="font-bold">{order.player_id || order.gameId || 'N/A'}</span>
            </div>
          </div>
          <p className="text-lg font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            ৳{order.total_amount || order.price || 0}
          </p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
        <User size={14} className="text-gray-400" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-900 truncate">{order.userName || order.user_name || order.display_name || 'Unknown'}</p>
          <p className="text-[10px] text-gray-500 truncate">{order.userEmail || order.contact_email || 'Unknown'}</p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <CreditCard size={14} className="text-gray-400" />
          <div>
            <p className="text-xs font-bold text-gray-900">{(order.payment_method || order.paymentMethod || 'Unknown').toUpperCase()}</p>
            <p className="text-[10px] text-gray-500">{order.transaction_id || order.transactionId || 'N/A'}</p>
          </div>
        </div>
        {(order.payment_proof_url || order.paymentProofImage) && (
          <button
            onClick={() => onShowProof(order)}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-lg text-[10px] font-bold active:scale-95 transition-transform"
          >
            <Eye size={10} />
            প্রুফ
          </button>
        )}
      </div>

      {/* Verification Status */}
      <div className={`flex items-center justify-between p-2 rounded-lg ${verificationConfig.bg} border ${verificationConfig.border} mb-3`}>
        <span className={`text-xs font-bold ${verificationConfig.color}`}>ভেরিফিকেশন: {verificationConfig.label}</span>
        {order.topupStatus && (
          <span className={`text-[10px] font-bold ${
            order.topupStatus === 'completed' ? 'text-green-600' :
            order.topupStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            Topup: {order.topupStatus}
          </span>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => onShowActions(order.id)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm active:scale-95 transition-transform shadow-lg"
      >
        <span>অ্যাকশন</span>
        <ChevronRight size={16} />
      </button>
    </motion.div>
  );
}
