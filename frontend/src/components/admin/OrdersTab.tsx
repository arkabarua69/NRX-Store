import { useState, useEffect } from "react";
import { Order } from "@/lib/types";
import { Search, Filter, Eye, RefreshCw, CheckCircle, XCircle, Clock, Package, X } from "lucide-react";
import { format } from "date-fns";
import { updateOrderStatus, verifyOrder } from "@/lib/orderService";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import MobileOrderCard from "./MobileOrderCard";

interface OrdersTabProps {
  orders: Order[];
}

export default function OrdersTab({ orders }: OrdersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [verificationFilter, setVerificationFilter] = useState<Order["verificationStatus"] | "all">("all");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [showProofModal, setShowProofModal] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState<string | null>(null);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (order.player_id || order.gameId || "").toLowerCase().includes(searchLower) ||
      (order.transaction_id || order.transactionId || "").toLowerCase().includes(searchLower) ||
      (order.userEmail || order.contact_email || "").toLowerCase().includes(searchLower) ||
      (order.userName || order.user_name || order.display_name || "").toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesVerification = verificationFilter === "all" || (order.verification_status || order.verificationStatus) === verificationFilter;
    return matchesSearch && matchesStatus && matchesVerification;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      
      // Backend automatically sends notification to user
      // No need to manually add notification here
      
      // Reload to show updated status
      window.location.reload();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleVerifyOrder = async (orderId: string, verify: boolean) => {
    setUpdatingOrderId(orderId);
    try {
      await verifyOrder(orderId, verify, verify ? "Payment verified" : "Payment verification failed");
      toast.success(verify ? "Order verified successfully" : "Order rejected");
      
      // Backend automatically sends notification to user
      // No need to manually add notification here
      
      // Reload to show updated status
      window.location.reload();
    } catch (error) {
      console.error("Error verifying order:", error);
      toast.error("Failed to verify order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "failed": return "bg-red-100 text-red-700";
      case "cancelled": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getVerificationColor = (status: Order["verificationStatus"]) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleShowProof = (order: Order) => {
    setSelectedOrder(order);
    setShowProofModal(order.id);
  };

  const handleRetryTopup = async (orderId: string) => {
    setUpdatingOrderId(orderId);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE}/orders/retry-topup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to retry topup");
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success("Topup completed successfully!");
      } else {
        toast.error(`Topup failed: ${result.message}`);
      }
      
      // Reload to show updated status
      window.location.reload();
    } catch (error) {
      console.error("Error retrying topup:", error);
      toast.error(error instanceof Error ? error.message : "Failed to retry topup");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getTopupStatusBadge = (order: Order) => {
    if (!order.topupStatus) return null;
    
    switch (order.topupStatus) {
      case "completed":
        return (
          <div className="flex items-center gap-1 text-xs text-green-600 font-bold mt-1">
            <CheckCircle size={12} />
            Topup Completed
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-1 text-xs text-red-600 font-bold mt-1">
            <XCircle size={12} />
            Topup Failed
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1 text-xs text-yellow-600 font-bold mt-1">
            <Clock size={12} />
            Topup Pending
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-3 sm:mb-4">
          {isMobile ? 'অর্ডার' : 'Orders'}
        </h2>
        
        {/* Mobile: Search + Filter Button */}
        {isMobile ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="সার্চ করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm active:scale-95 transition-transform"
              >
                <Filter size={16} />
                ফিল্টার
                {(statusFilter !== 'all' || verificationFilter !== 'all') && (
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                )}
              </button>
              <div className="px-4 py-2.5 bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="text-sm font-black text-gray-700">{filteredOrders.length}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop: Original Filters */
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by Game ID, Transaction ID, Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF3B30] focus:outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF3B30] focus:outline-none appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value as any)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF3B30] focus:outline-none appearance-none bg-white"
              >
                <option value="all">All Verification</option>
                <option value="pending">Pending Verification</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Card Grid */}
      {isMobile ? (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <MobileOrderCard
              key={order.id}
              order={order}
              onShowProof={handleShowProof}
              onShowActions={setShowActionSheet}
            />
          ))}
        </div>
      ) : (
        /* Desktop: Table */
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Order Info</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Topup</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="font-bold text-gray-900 text-sm">{order.productName || order.product_name || "Unknown Product"}</div>
                  <div className="text-xs text-gray-600">💎 {order.diamonds || 0} | 🎮 {order.player_id || order.gameId || "N/A"}</div>
                  <div className="text-xs text-gray-500 mt-1">{format(new Date(order.createdAt || order.created_at), "MMM dd, HH:mm")}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-gray-900 text-sm">{order.userName || order.user_name || order.display_name || "Unknown User"}</div>
                  <div className="text-xs text-gray-600">{order.userEmail || order.contact_email || "Unknown"}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-bold text-[#FF3B30]">৳{order.total_amount || order.price || 0}</div>
                  <div className="text-xs text-gray-600">{(order.payment_method || order.paymentMethod || "Unknown").toUpperCase()}</div>
                  <div className="text-xs text-gray-500">{order.transaction_id || order.transactionId || "N/A"}</div>
                  {(order.payment_proof_url || order.paymentProofImage) && (
                    <button
                      onClick={() => handleShowProof(order)}
                      className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={12} />
                      View Proof
                    </button>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getVerificationColor(order.verification_status || order.verificationStatus || "pending")}`}>
                      {(order.verification_status || order.verificationStatus || "pending").toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {getTopupStatusBadge(order)}
                  {order.topupMessage && (
                    <div className="text-xs text-gray-500 mt-1 max-w-xs">
                      {order.topupMessage}
                    </div>
                  )}
                  {(order.topupAttempts || 0) > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      Attempts: {order.topupAttempts}/3
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order["status"])}
                      disabled={updatingOrderId === order.id}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-[#FF3B30] focus:outline-none disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    {(order.verification_status || order.verificationStatus) === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerifyOrder(order.id, true)}
                          disabled={updatingOrderId === order.id}
                          className="flex-1 px-2 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerifyOrder(order.id, false)}
                          disabled={updatingOrderId === order.id}
                          className="flex-1 px-2 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    
                    {(order.verification_status || order.verificationStatus) === "verified" && 
                     order.topupStatus === "failed" && 
                     (order.topupAttempts || 0) < 3 && (
                      <button
                        onClick={() => handleRetryTopup(order.id)}
                        disabled={updatingOrderId === order.id}
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                      >
                        <RefreshCw size={12} />
                        Retry Topup
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 font-bold">{isMobile ? 'কোন অর্ডার নেই' : 'No orders found'}</p>
        </div>
      )}

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {showFilterModal && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowFilterModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900">ফিল্টার</h3>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">স্ট্যাটাস</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                  >
                    <option value="all">সব</option>
                    <option value="pending">পেন্ডিং</option>
                    <option value="processing">প্রসেসিং</option>
                    <option value="completed">সম্পন্ন</option>
                    <option value="failed">ব্যর্থ</option>
                    <option value="cancelled">বাতিল</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ভেরিফিকেশন</label>
                  <select
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                  >
                    <option value="all">সব</option>
                    <option value="pending">পেন্ডিং</option>
                    <option value="verified">ভেরিফাইড</option>
                    <option value="rejected">রিজেক্টেড</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setVerificationFilter('all');
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold active:scale-95 transition-transform"
                  >
                    রিসেট
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold active:scale-95 transition-transform"
                  >
                    প্রয়োগ করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Action Sheet */}
      <AnimatePresence>
        {showActionSheet && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowActionSheet(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-t-3xl w-full p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const order = orders.find(o => o.id === showActionSheet);
                if (!order) return null;

                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black text-gray-900">অ্যাকশন</h3>
                      <button
                        onClick={() => setShowActionSheet(null)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Status Update */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">স্ট্যাটাস পরিবর্তন</label>
                        <select
                          value={order.status}
                          onChange={(e) => {
                            handleStatusUpdate(order.id, e.target.value as Order["status"]);
                            setShowActionSheet(null);
                          }}
                          disabled={updatingOrderId === order.id}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold disabled:opacity-50"
                        >
                          <option value="pending">পেন্ডিং</option>
                          <option value="processing">প্রসেসিং</option>
                          <option value="completed">সম্পন্ন</option>
                          <option value="failed">ব্যর্থ</option>
                          <option value="cancelled">বাতিল</option>
                        </select>
                      </div>

                      {/* Verification Actions */}
                      {(order.verification_status || order.verificationStatus) === "pending" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              handleVerifyOrder(order.id, true);
                              setShowActionSheet(null);
                            }}
                            disabled={updatingOrderId === order.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-50"
                          >
                            <CheckCircle size={18} />
                            অনুমোদন
                          </button>
                          <button
                            onClick={() => {
                              handleVerifyOrder(order.id, false);
                              setShowActionSheet(null);
                            }}
                            disabled={updatingOrderId === order.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-50"
                          >
                            <XCircle size={18} />
                            রিজেক্ট
                          </button>
                        </div>
                      )}

                      {/* Retry Topup */}
                      {(order.verification_status || order.verificationStatus) === "verified" && 
                       order.topupStatus === "failed" && 
                       ((order.topupAttempts || 0) < 3) && (
                        <button
                          onClick={() => {
                            handleRetryTopup(order.id);
                            setShowActionSheet(null);
                          }}
                          disabled={updatingOrderId === order.id}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-50"
                        >
                          <RefreshCw size={18} />
                          টপআপ পুনরায় চেষ্টা
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Proof Modal */}
      {showProofModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-black text-gray-900">
                {isMobile ? 'পেমেন্ট প্রুফ' : 'Payment Proof'}
              </h3>
              <button
                onClick={() => setShowProofModal(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {(selectedOrder.payment_proof_url || selectedOrder.paymentProofImage) ? (
              <div className="mb-4">
                <img
                  src={selectedOrder.payment_proof_url || selectedOrder.paymentProofImage}
                  alt="Payment Proof"
                  className="w-full h-64 object-cover rounded-xl border border-gray-200"
                />
              </div>
            ) : (
              <div className="mb-4 p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-gray-500 text-sm">
                  {isMobile ? 'কোন প্রুফ আপলোড করা হয়নি' : 'No payment proof uploaded'}
                </p>
              </div>
            )}
            
            <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <h4 className="font-bold text-gray-900 mb-2 text-sm">
                {isMobile ? 'অর্ডার বিস্তারিত:' : 'Order Details:'}
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-semibold">Product:</span> {selectedOrder.productName || selectedOrder.product_name || "Unknown"}</p>
                <p><span className="font-semibold">Game ID:</span> {selectedOrder.player_id || selectedOrder.gameId || "N/A"}</p>
                <p><span className="font-semibold">Amount:</span> ৳{selectedOrder.total_amount || selectedOrder.price || 0}</p>
                <p><span className="font-semibold">Method:</span> {(selectedOrder.payment_method || selectedOrder.paymentMethod || "Unknown").toUpperCase()}</p>
                <p><span className="font-semibold">TrxID:</span> {selectedOrder.transaction_id || selectedOrder.transactionId || "N/A"}</p>
              </div>
            </div>
            
            {(selectedOrder.verification_notes || selectedOrder.verificationNotes) && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2 text-sm">
                  {isMobile ? 'নোট:' : 'Verification Notes:'}
                </h4>
                <p className="text-xs text-gray-600">
                  {selectedOrder.verification_notes || selectedOrder.verificationNotes}
                </p>
              </div>
            )}
            
            <button
              onClick={() => setShowProofModal(null)}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold active:scale-95 transition-transform"
            >
              {isMobile ? 'বন্ধ করুন' : 'Close'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
