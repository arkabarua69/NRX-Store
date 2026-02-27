import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  badge?: string;
  badgeGradient?: string;
  path: string;
  delay?: number;
}

export default function FeatureCard({
  icon: Icon,
  title,
  subtitle,
  description,
  gradient,
  badge,
  badgeGradient,
  path,
  delay = 0,
}: FeatureCardProps) {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      onClick={() => navigate(path)}
      className="relative overflow-hidden bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm active:scale-95 transition-all text-left w-full"
    >
      {/* Badge */}
      {badge && (
        <div className={`absolute top-3 right-3 bg-gradient-to-r ${badgeGradient || gradient} text-white px-2.5 py-1 rounded-full text-xs font-black shadow-lg`}>
          {badge}
        </div>
      )}

      {/* Background Gradient Blob */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-10`} />

      <div className="relative flex flex-col items-center gap-4">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon size={32} className="text-white" />
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-black text-gray-900 mb-1">{title}</h3>
          <p className="text-sm font-bold text-gray-600 mb-2">{subtitle}</p>
          <p className="text-xs text-gray-500 font-medium">{description}</p>
        </div>

        {/* Action Indicator */}
        <div className={`mt-2 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradient} text-white font-bold text-sm shadow-md`}>
          <span>দেখুন</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-pulse">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </motion.button>
  );
}
