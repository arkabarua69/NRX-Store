import { X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
  loading?: boolean;
}

export default function CancelOrderModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  orderNumber,
  loading = false 
}: CancelOrderModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                  disabled={loading}
                >
                  <X size={20} className="text-white" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <AlertCircle size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">অর্ডার বাতিল</h2>
                    <p className="text-sm text-white/80 font-medium">নিশ্চিত করুন</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
                  <p className="text-gray-900 font-bold text-center mb-2">
                    আপনি কি নিশ্চিত যে আপনি এই অর্ডারটি বাতিল করতে চান?
                  </p>
                  <p className="text-sm text-gray-600 text-center">
                    অর্ডার নম্বর: <span className="font-black text-red-600">#{orderNumber}</span>
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6">
                  <p className="text-xs text-yellow-800 font-medium text-center">
                    ⚠️ এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 rounded-xl font-bold transition-colors disabled:opacity-50"
                  >
                    না, রাখুন
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 active:from-red-700 active:to-pink-700 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        বাতিল হচ্ছে...
                      </span>
                    ) : (
                      'হ্যাঁ, বাতিল করুন'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
