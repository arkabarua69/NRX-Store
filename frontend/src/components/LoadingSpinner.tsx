import { Diamond, Sparkles, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ 
  message = "লোড হচ্ছে...", 
  submessage = "অনুগ্রহ করে অপেক্ষা করুন",
  fullScreen = true,
  size = 'md'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 48
  };

  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-purple-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="text-center">
        {/* Animated Loading Icon */}
        <div className="relative mx-auto mb-6" style={{ width: sizeClasses[size].split(' ')[0].replace('w-', '') + 'px', height: sizeClasses[size].split(' ')[1].replace('h-', '') + 'px' }}>
          {/* Outer Ring - Ping Effect */}
          <div className="absolute inset-0 border-4 border-red-200 rounded-full animate-ping opacity-75" />
          
          {/* Middle Ring - Rotating */}
          <div className="absolute inset-0 border-4 border-transparent border-t-red-500 border-r-pink-500 rounded-full animate-spin" />
          
          {/* Inner Ring - Counter Rotating */}
          <div className="absolute inset-2 border-4 border-transparent border-b-purple-500 border-l-red-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
          
          {/* Center Icon - Pulsing */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Diamond 
              className="text-red-500 animate-pulse" 
              size={iconSizes[size]} 
            />
          </div>
          
          {/* Sparkles - Floating */}
          <Sparkles 
            className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" 
            size={iconSizes[size] / 2}
            style={{ animationDelay: '0.2s' }}
          />
          <Zap 
            className="absolute -bottom-2 -left-2 text-purple-500 animate-bounce" 
            size={iconSizes[size] / 2}
            style={{ animationDelay: '0.4s' }}
          />
        </div>

        {/* Loading Text */}
        <h3 className="text-gray-800 font-black text-xl mb-2 animate-pulse">
          {message}
        </h3>
        <p className="text-gray-600 text-sm font-medium mb-6">
          {submessage}
        </p>

        {/* Animated Dots */}
        <div className="flex items-center justify-center gap-2">
          <div 
            className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce" 
            style={{ animationDelay: '0ms' }} 
          />
          <div 
            className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-bounce" 
            style={{ animationDelay: '150ms' }} 
          />
          <div 
            className="w-3 h-3 bg-gradient-to-r from-purple-500 to-red-500 rounded-full animate-bounce" 
            style={{ animationDelay: '300ms' }} 
          />
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-full animate-pulse" 
               style={{ 
                 width: '100%',
                 animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite',
               }} 
          />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
