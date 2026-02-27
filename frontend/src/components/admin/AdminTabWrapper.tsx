import { ReactNode } from 'react';

interface AdminTabWrapperProps {
  children: ReactNode;
  title?: string;
}

export default function AdminTabWrapper({ children, title }: AdminTabWrapperProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {title && (
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">
          {title}
        </h2>
      )}
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {children}
      </div>
    </div>
  );
}

// Reusable mobile-responsive components for admin tabs
export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function AdminGrid({ children, cols = 4 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const colsClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };
  
  return (
    <div className={`grid grid-cols-1 ${colsClass[cols]} gap-3 sm:gap-4 lg:gap-6`}>
      {children}
    </div>
  );
}

export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 sm:rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            {children}
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminButton({ children, className = '', ...props }: any) {
  return (
    <button
      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminInput({ className = '', ...props }: any) {
  return (
    <input
      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
}

export function AdminBadge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${className}`}>
      {children}
    </span>
  );
}

export function AdminStatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  gradient = 'from-blue-500 to-cyan-500'
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: 'up' | 'down';
  trendValue?: string;
  gradient?: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 text-white shadow-lg hover:shadow-xl transition-all`}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
          <Icon size={20} className="sm:w-6 sm:h-6" />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${
            trend === 'up' ? 'bg-green-500/30' : 'bg-red-500/30'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>
        )}
      </div>
      <p className="text-white/80 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">{title}</p>
      <p className="text-2xl sm:text-3xl lg:text-4xl font-black">{value}</p>
    </div>
  );
}
