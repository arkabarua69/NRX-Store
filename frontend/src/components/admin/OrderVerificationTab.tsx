import { useState } from "react";
import { Order } from "@/lib/types";
import { Search, Filter, X, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { verifyOrder } from "@/lib/orderService";
import { toast } from "sonner";

interface OrderVerificationTabProps {
  orders: Order[];
  onVerificationComplete?: () => void;
}

export default function OrderVerificationTab({ orders, onVerificationComplete }: OrderVerificationTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showProofModal, setShowProofModal] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const pendingOrders = orders.filter((order) => (order.verification_status || order.verificationStatus) === "pending");

  const filteredOrders = pendingOrders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (order.player_id || order.gameId || "").toLowerCase().includes(searchLower) ||
      (order.transaction_id || order.transactionId || "").toLowerCase().includes(searchLower) ||
      (order.userEmail || order.contact_email || "").toLowerCase().includes(searchLower) ||
      (order.userName || order.user_name || order.display_name || "").toLowerCase().includes(searchLower);
    return matchesSearch;
  });

  const handleVerifyOrder = async (orderId: string, verify: boolean) => {
    setUpdatingOrderId(orderId);
    try {
      await verifyOrder(orderId, verify, verify ? "Payment verified" : "Payment verification failed");
      toast.success(verify ? "Order verified successfully" : "Order rejected");
      
      // Backend automatically sends notification to user
      // No need to manually add notification here
      
      onVerificationComplete?.();
    } catch (error) {
      console.error("Error verifying order:", error);
      toast.error("Failed to verify order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleShowProof = (order: Order) => {
    setSelectedOrder(order);
    setShowProofModal(order.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-4">
          Payment Verification Queue ({pendingOrders.length} Pending)
        </h2>
        
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Game ID, Transaction ID, Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF3B30] focus:outline-none"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Pending Verifications</h3>
          <p className="text-gray-500">All orders have been verified</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] duration-300">
              {/* Header */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold shadow-md animate-pulse">
                      PENDING
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{format(new Date(order.createdAt || order.created_at), "MMM dd, HH:mm")}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{order.productName || order.product_name || "Unknown Product"}</h3>
                  <p className="text-xs text-gray-500 font-mono">#{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#FF3B30] mb-1">৳{order.total_amount || order.price || 0}</div>
                  <div className="text-xs text-gray-600 font-semibold px-2 py-1 bg-gray-100 rounded-lg">{(order.payment_method || order.paymentMethod || "Unknown").toUpperCase()}</div>
                </div>
              </div>

              {/* Customer & Order Info */}
              <div className="space-y-3 mb-4">
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <h4 className="font-bold text-blue-900 text-xs mb-2 flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    CUSTOMER INFO
                  </h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="flex justify-between"><span className="font-medium text-gray-600">Name:</span> <span className="font-semibold">{order.userName || order.user_name || order.display_name || "Unknown"}</span></p>
                    <p className="flex justify-between"><span className="font-medium text-gray-600">Email:</span> <span className="font-semibold text-xs">{order.userEmail || order.contact_email || "Unknown"}</span></p>
                    <p className="flex justify-between"><span className="font-medium text-gray-600">Phone:</span> <span className="font-semibold">{order.phoneNumber || order.contact_phone || "N/A"}</span></p>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                  <h4 className="font-bold text-purple-900 text-xs mb-2 flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    ORDER DETAILS
                  </h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="flex justify-between"><span className="font-medium text-gray-600">Game ID:</span> <span className="font-semibold font-mono text-xs">{order.player_id || order.gameId || "N/A"}</span></p>
                    <p className="flex justify-between"><span className="font-medium text-gray-600">Transaction:</span> <span className="font-semibold font-mono text-xs">{order.transaction_id || order.transactionId || "N/A"}</span></p>
                    <p className="flex justify-between"><span className="font-medium text-gray-600">Diamonds:</span> <span className="font-bold text-purple-600">{order.diamonds || 0} 💎</span></p>
                  </div>
                </div>
              </div>

              {/* Payment Proof */}
              {(order.payment_proof_url || order.paymentProofImage) && (
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 text-xs mb-2 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    PAYMENT PROOF
                  </h4>
                  <div className="relative group">
                    <img
                      src={order.payment_proof_url || order.paymentProofImage}
                      alt="Payment Proof"
                      className="w-full h-40 object-cover rounded-xl border-2 border-gray-200 group-hover:border-[#FF3B30] transition-colors"
                    />
                    <button
                      onClick={() => handleShowProof(order)}
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-xl transition-all flex items-center justify-center"
                    >
                      <span className="px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all shadow-lg">
                        View Full Size
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleVerifyOrder(order.id, true)}
                  disabled={updatingOrderId === order.id}
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleVerifyOrder(order.id, false)}
                  disabled={updatingOrderId === order.id}
                  className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Proof Modal */}
      {showProofModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Payment Proof</h3>
              <button
                onClick={() => setShowProofModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            {(selectedOrder.payment_proof_url || selectedOrder.paymentProofImage) ? (
              <div className="mb-6">
                <img
                  src={selectedOrder.payment_proof_url || selectedOrder.paymentProofImage}
                  alt="Payment Proof"
                  className="w-full rounded-xl border border-gray-200"
                />
              </div>
            ) : (
              <div className="mb-6 p-8 bg-gray-50 rounded-xl text-center">
                <p className="text-gray-500">No payment proof uploaded</p>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Details</h4>
                <div className="text-sm space-y-2">
                  <p><span className="font-medium">Order:</span> {selectedOrder.productName || selectedOrder.product_name || "Unknown"}</p>
                  <p><span className="font-medium">Game ID:</span> {selectedOrder.player_id || selectedOrder.gameId || "N/A"}</p>
                  <p><span className="font-medium">Price:</span> ৳{selectedOrder.total_amount || selectedOrder.price || 0}</p>
                  <p><span className="font-medium">Transaction:</span> {selectedOrder.transaction_id || selectedOrder.transactionId || "N/A"}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Customer</h4>
                <div className="text-sm space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedOrder.userName || selectedOrder.user_name || selectedOrder.display_name || "Unknown"}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.userEmail || selectedOrder.contact_email || "Unknown"}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.phoneNumber || selectedOrder.contact_phone || "N/A"}</p>
                </div>
              </div>
            </div>
            {(selectedOrder.verification_notes || selectedOrder.verificationNotes) && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Verification Notes</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedOrder.verification_notes || selectedOrder.verificationNotes}
                </p>
              </div>
            )}
            <button
              onClick={() => setShowProofModal(null)}
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
