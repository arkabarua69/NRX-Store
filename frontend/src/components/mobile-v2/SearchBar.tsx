import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilter?: () => void;
  placeholder?: string;
  showFilter?: boolean;
}

export default function SearchBar({ 
  value, 
  onChange, 
  onFilter, 
  placeholder = 'খুঁজুন...', 
  showFilter = false 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="px-4 py-3">
      <div 
        className={`
          flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3
          transition-all duration-200
          ${isFocused ? 'ring-2 ring-red-500 ring-offset-2 bg-white' : ''}
        `}
      >
        <Search size={20} className={isFocused ? 'text-red-500' : 'text-gray-400'} />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 font-medium"
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => onChange('')}
              className="p-1 rounded-full bg-gray-200 active:bg-gray-300 transition-colors"
            >
              <X size={14} className="text-gray-600" />
            </motion.button>
          )}
        </AnimatePresence>

        {showFilter && (
          <button
            onClick={onFilter}
            className="p-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white active:scale-95 transition-transform"
          >
            <SlidersHorizontal size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
