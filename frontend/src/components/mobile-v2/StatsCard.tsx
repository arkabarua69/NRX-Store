import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  gradient: string;
  delay?: number;
}

export default function StatsCard({ icon: Icon, label, value, gradient, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm active:scale-95 transition-transform"
    >
      {/* Background Gradient Blob */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-10`} />
      
      <div className="relative flex items-center gap-3">
        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-600 font-bold mb-0.5 truncate">{label}</p>
          <p className="text-2xl font-black text-gray-900 truncate">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
