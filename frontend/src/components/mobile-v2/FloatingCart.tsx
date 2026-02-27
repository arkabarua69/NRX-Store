import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface FloatingCartProps {
  itemCount: number;
  totalPrice: number;
}

export default function FloatingCart({ itemCount, totalPrice }: FloatingCartProps) {
  const navigate = useNavigate();

  if (itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        onClick={() => navigate('/cart')}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-3.5 rounded-full shadow-2xl active:scale-95 transition-transform"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <ShoppingCart size={22} />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center text-xs font-black"
          >
            {itemCount}
          </motion.div>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-medium opacity-90">কার্ট দেখুন</span>
          <span className="text-sm font-black">৳{totalPrice}</span>
        </div>
      </motion.button>
    </AnimatePresence>
  );
}
