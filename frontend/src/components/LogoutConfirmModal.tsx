import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmModal({ isOpen, onConfirm, onCancel }: LogoutConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 relative">
                <button
                  onClick={onCancel}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
                    <LogOut size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-white">লগআউট করবেন?</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-center text-gray-600 font-medium mb-6">
                  আপনি কি নিশ্চিত যে আপনি লগআউট করতে চান?
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-black hover:bg-gray-200 active:scale-95 transition-all"
                  >
                    না
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-black hover:shadow-lg active:scale-95 transition-all"
                  >
                    হ্যাঁ, লগআউট
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
