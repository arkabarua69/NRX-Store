import { useState } from "react";
import { Order } from "@/lib/types";
import { X, Check, AlertCircle, Image as ImageIcon, Calendar, User, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/adminService";

interface PaymentVerificationModalProps {
  order: Order;
  onClose: () => void;
  onVerified: () => void;
}

export default function PaymentVerificationModal({ order, onClose, onVerified }: PaymentVerificationModalProps) {
  const [verifying, setVerifying] = useState(false);
  const [notes, setNotes] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleVerify = async (approved: boolean) => {
    if (!notes.trim() && !approved) {
      toast.error("Please add rejection notes");
      return;
    }

    setVerifying(true);
    try {
      await updateOrderStatus(order.id, {
        verificationStatus: approved ? "verified" : "rejected",
        verificationNotes: notes || (approved ? "Payment verified successfully" : "Payment verification failed"),
        status: approved ? "processing" : "cancelled",
      });

      toast.success(approved ? "Payment verified successfully!" : "Payment rejected");
      onVerified();
      onClose();
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Failed to verify payment");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">Payment Verification</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <User size={20} className="text-[#FF3B30]" />
                Customer Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Name</p>
                  <p className="text-sm font-bold text-gray-900">{order.userName || order.user_name || order.display_name || 'Unknown User'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                  <p className="text-sm font-bold text-gray-900">{order.userEmail}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Game ID</p>
                  <p className="text-sm font-bold text-gray-900">{order.gameId}</p>
                </div>
                {order.phoneNumber && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Phone</p>
                    <p className="text-sm font-bold text-gray-900">{order.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CreditCard size={20} className="text-[#FF3B30]" />
                Payment Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Product</p>
                  <p className="text-sm font-bold text-gray-900">{order.productName}</p>
                  <p className="text-xs text-gray-600">💎 {order.diamonds} Diamonds</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Amount</p>
                  <p className="text-2xl font-black text-[#FF3B30]">৳{order.price}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Payment Method</p>
                  <p className="text-sm font-bold text-gray-900">{order.paymentMethod.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Transaction ID</p>
                  <p className="text-sm font-bold text-gray-900 font-mono">{order.transactionId}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Order Date</p>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    <Calendar size={14} />
                    {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Proof */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon size={20} className="text-[#FF3B30]" />
              Payment Proof Screenshot
            </h3>
            {order.paymentProofImage ? (
              <div className="relative bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#FF3B30] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <img
                  src={order.paymentProofImage}
                  alt="Payment Proof"
                  className="w-full max-h-[500px] object-contain rounded-lg"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageLoaded(true);
                    toast.error("Failed to load payment proof image");
                  }}
                />
                <a
                  href={order.paymentProofImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  <ImageIcon size={16} />
                  Open in New Tab
                </a>
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <p className="text-sm font-bold text-yellow-800">No payment proof uploaded</p>
                <p className="text-xs text-yellow-600 mt-1">Customer did not upload payment screenshot</p>
              </div>
            )}
          </div>

          {/* Verification Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Verification Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this verification (optional for approval, required for rejection)"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FF3B30] focus:outline-none resize-none"
              rows={4}
            />
          </div>

          {/* Previous Notes */}
          {order.verificationNotes && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <h4 className="text-sm font-bold text-blue-900 mb-2">Previous Verification Notes:</h4>
              <p className="text-sm text-blue-800">{order.verificationNotes}</p>
              {order.verifiedBy && (
                <p className="text-xs text-blue-600 mt-2">
                  Verified by: {order.verifiedBy} on {order.verifiedAt && format(new Date(order.verifiedAt), "MMM dd, yyyy HH:mm")}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleVerify(true)}
              disabled={verifying}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all disabled:opacity-50"
            >
              <Check size={20} />
              {verifying ? "Verifying..." : "Approve Payment"}
            </button>
            <button
              onClick={() => handleVerify(false)}
              disabled={verifying}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all disabled:opacity-50"
            >
              <X size={20} />
              {verifying ? "Rejecting..." : "Reject Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
