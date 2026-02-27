import { Home, ShoppingCart, CheckCircle, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminMobileNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: {
    todayOrders: number;
    pendingVerification: number;
    activeProducts: number;
  };
}

export default function AdminMobileNavBar({ activeTab, onTabChange, stats }: AdminMobileNavBarProps) {
  const navItems = [
    { 
      id: 'overview',
      icon: Home, 
      label: 'Overview', 
      gradient: 'from-blue-500 to-cyan-500',
      badge: null
    },
    { 
      id: 'orders',
      icon: ShoppingCart, 
      label: 'Orders', 
      gradient: 'from-purple-500 to-pink-500',
      badge: stats.todayOrders
    },
    { 
      id: 'verification',
      icon: CheckCircle, 
      label: 'Verification', 
      gradient: 'from-yellow-500 to-orange-500',
      badge: stats.pendingVerification
    },
    { 
      id: 'products',
      icon: Package, 
      label: 'Products', 
      gradient: 'from-green-500 to-emerald-500',
      badge: stats.activeProducts
    },
  ];

  const isActive = (id: string) => activeTab === id;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 shadow-2xl lg:hidden"
      style={{ paddingBottom: 'var(--safe-area-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center justify-center min-w-[70px] py-1 px-3 transition-all"
            >
              {/* Active Background */}
              {active && (
                <motion.div
                  layoutId="activeAdminTab"
                  className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 rounded-2xl`}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon Container */}
              <div className="relative">
                <div className={`p-2 rounded-xl transition-all ${
                  active 
                    ? `bg-gradient-to-r ${item.gradient}` 
                    : 'bg-transparent'
                }`}>
                  <Icon 
                    size={22} 
                    className={active ? 'text-white' : 'text-gray-500'} 
                    strokeWidth={active ? 2.5 : 2}
                  />
                </div>

                {/* Badge */}
                {item.badge !== null && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-[10px] font-black text-white">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Label */}
              <span 
                className={`text-[10px] font-bold mt-1 transition-colors ${
                  active ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
