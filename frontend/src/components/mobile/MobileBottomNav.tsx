import { Home, ShoppingBag, Package, User, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'হোম', path: '/', key: 'home' },
    { icon: ShoppingBag, label: 'স্টোর', path: '/store', key: 'store' },
    { icon: Package, label: 'অর্ডার', path: '/dashboard', key: 'orders' },
    { icon: User, label: 'প্রোফাইল', path: '/settings', key: 'profile' },
    { icon: Menu, label: 'আরও', path: '/about', key: 'more' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl transition-all ${
                active 
                  ? 'text-red-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`relative ${active ? 'scale-110' : ''} transition-transform`}>
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full" />
                )}
              </div>
              <span className={`text-xs mt-1 font-semibold ${active ? 'text-red-500' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
