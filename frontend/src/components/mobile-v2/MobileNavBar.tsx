import { Home, Store, Package, User, Menu, Heart, Settings, HelpCircle, LogOut, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LogoutConfirmModal from '@/components/LogoutConfirmModal';

export default function MobileNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { 
      icon: Home, 
      label: 'হোম', 
      path: '/', 
      gradient: 'from-blue-500 to-cyan-500' 
    },
    { 
      icon: Store, 
      label: 'স্টোর', 
      path: '/store', 
      gradient: 'from-purple-500 to-pink-500' 
    },
    { 
      icon: Menu, 
      label: 'মেনু', 
      path: '#menu', 
      gradient: 'from-yellow-500 to-orange-500',
      special: true,
      onClick: () => setShowMenu(true)
    },
    { 
      icon: Package, 
      label: 'অর্ডার', 
      path: '/dashboard', 
      gradient: 'from-green-500 to-emerald-500' 
    },
    { 
      icon: User, 
      label: 'প্রোফাইল', 
      path: '/profile', 
      gradient: 'from-red-500 to-pink-500' 
    },
  ];

  const menuItems = [
    { 
      icon: Heart, 
      label: 'উইশলিস্ট', 
      path: '/wishlist', 
      gradient: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      description: 'পছন্দের পণ্য'
    },
    { 
      icon: Settings, 
      label: 'সেটিংস', 
      path: '/settings', 
      gradient: 'from-gray-600 to-gray-700',
      bgColor: 'bg-gray-50',
      description: 'অ্যাকাউন্ট সেটিংস'
    },
    { 
      icon: HelpCircle, 
      label: 'সাপোর্ট', 
      path: '/support', 
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      description: 'সহায়তা কেন্দ্র'
    },
    { 
      icon: HelpCircle, 
      label: 'FAQ', 
      path: '/faq', 
      gradient: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      description: 'সাধারণ প্রশ্ন'
    },
    { 
      icon: LogOut, 
      label: 'লগআউট', 
      path: '#logout', 
      gradient: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      description: 'অ্যাকাউন্ট থেকে বের হন',
      onClick: () => {
        setShowMenu(false);
        setShowLogoutModal(true);
      }
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' || path === '#menu') return location.pathname === '/';
    if (path.includes('?')) {
      const [basePath, query] = path.split('?');
      return location.pathname === basePath && location.search.includes(query);
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (item: any) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path !== '#menu') {
      navigate(item.path);
    }
  };

  const handleMenuItemClick = (item: any) => {
    if (item.onClick) {
      item.onClick();
    } else {
      navigate(item.path);
      setShowMenu(false);
    }
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-2xl"
        style={{ paddingBottom: 'var(--safe-area-bottom)' }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item)}
                className="relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 transition-all"
              >
                {/* Active Background */}
                {active && item.path !== '#menu' && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 rounded-2xl`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Icon Container */}
                <div className="relative">
                  {item.special ? (
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${item.gradient} shadow-lg`}>
                      <Icon size={22} className="text-white" strokeWidth={2.5} />
                    </div>
                  ) : (
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
                  )}
                </div>

                {/* Label */}
                <span 
                  className={`text-[10px] font-bold mt-1 transition-colors ${
                    active && item.path !== '#menu'
                      ? 'text-gray-900' 
                      : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Menu Dropdown */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-gradient-to-b from-white to-gray-50 rounded-t-3xl shadow-2xl overflow-hidden"
              style={{ paddingBottom: 'var(--safe-area-bottom)' }}
            >
              {/* Decorative Top Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
              
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1">মেনু</h3>
                  <p className="text-sm text-gray-500 font-medium">আরও অপশন দেখুন</p>
                </div>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
                >
                  <X size={22} className="text-gray-700" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="px-4 pb-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleMenuItemClick(item)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl ${item.bgColor} border-2 border-transparent hover:border-gray-200 active:scale-[0.98] transition-all shadow-sm hover:shadow-md group`}
                    >
                      {/* Icon with Gradient */}
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon size={22} className="text-white" strokeWidth={2.5} />
                      </div>
                      
                      {/* Text Content */}
                      <div className="flex-1 text-left">
                        <h4 className="text-base font-black text-gray-900 mb-0.5">{item.label}</h4>
                        <p className="text-xs text-gray-600 font-medium">{item.description}</p>
                      </div>

                      {/* Arrow Icon */}
                      <div className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={async () => {
          setShowLogoutModal(false);
          await logout();
          navigate('/login');
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
