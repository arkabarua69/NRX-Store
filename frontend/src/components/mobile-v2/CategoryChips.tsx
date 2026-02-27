import { Sparkles, Star, Flame, Crown, Zap, Gift, TrendingUp, Diamond } from 'lucide-react';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
  gradient: string;
}

interface CategoryChipsProps {
  selected: string;
  onSelect: (id: string) => void;
}

const categories: Category[] = [
  { 
    id: 'all', 
    label: 'সব', 
    icon: Sparkles, 
    gradient: 'from-purple-500 to-pink-500' 
  },
  { 
    id: 'budget', 
    label: 'বাজেট', 
    icon: Star, 
    gradient: 'from-blue-500 to-cyan-500' 
  },
  { 
    id: 'standard', 
    label: 'জনপ্রিয়', 
    icon: Flame, 
    gradient: 'from-yellow-500 to-orange-500' 
  },
  { 
    id: 'premium', 
    label: 'বিগ প্যাক', 
    icon: Diamond, 
    gradient: 'from-red-500 to-pink-500' 
  },
  { 
    id: 'membership', 
    label: 'মেম্বার', 
    icon: Crown, 
    gradient: 'from-purple-500 to-indigo-500' 
  },
  { 
    id: 'featured', 
    label: 'ফিচার্ড', 
    icon: TrendingUp, 
    gradient: 'from-green-500 to-emerald-500' 
  },
];

export default function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-3 scroll-snap-x">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selected === category.id;

        return (
          <motion.button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`
              relative flex items-center gap-2 px-4 py-2.5 rounded-full
              font-bold text-sm whitespace-nowrap scroll-snap-item
              transition-all duration-200 active:scale-95
              ${isSelected 
                ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg` 
                : 'bg-white text-gray-700 border-2 border-gray-200'
              }
            `}
            whileTap={{ scale: 0.95 }}
          >
            {isSelected && (
              <motion.div
                layoutId="selectedCategory"
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={16} className={isSelected ? 'text-white' : 'text-gray-600'} />
            <span className="relative z-10">{category.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
