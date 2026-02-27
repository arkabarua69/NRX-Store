import { ArrowLeft, Search, Bell, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileAppBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotification?: boolean;
  showCart?: boolean;
  showLogo?: boolean;
  transparent?: boolean;
  elevated?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  onNotification?: () => void;
  onCart?: () => void;
  notificationCount?: number;
  cartCount?: number;
  leftAction?: React.ReactNode;
  rightActions?: React.ReactNode;
}

export default function MobileAppBar({
  title,
  subtitle,
  showBack = false,
  showSearch = false,
  showNotification = false,
  showCart = false,
  showLogo = false,
  transparent = false,
  elevated = true,
  onBack,
  onSearch,
  onNotification,
  onCart,
  notificationCount = 0,
  cartCount = 0,
  leftAction,
  rightActions,
}: MobileAppBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        ${transparent ? 'bg-transparent' : 'bg-white'}
        ${elevated && !transparent ? 'shadow-sm border-b border-gray-100' : ''}
        transition-all duration-300
      `}
      style={{ paddingTop: 'var(--safe-area-top)' }}
    >
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {leftAction || (
            <>
              {showBack && (
                <button
                  onClick={handleBack}
                  className="p-2 -ml-2 rounded-xl active:bg-gray-100 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft size={24} className={transparent ? 'text-white' : 'text-gray-900'} />
                </button>
              )}
              {showLogo && !showBack && (
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <img
                    src="/logo.jpg"
                    alt="NRX Store"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className={`text-xl font-black ${transparent ? 'text-white' : 'text-gray-900'}`}>
                    NRX Store
                  </span>
                </button>
              )}
            </>
          )}

          {title && !showLogo && (
            <div className="flex-1 min-w-0">
              <h1 className={`text-lg font-black truncate ${transparent ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h1>
              {subtitle && (
                <p className={`text-xs truncate ${transparent ? 'text-white/80' : 'text-gray-500'}`}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          {rightActions || (
            <>
              {showSearch && (
                <button
                  onClick={onSearch}
                  className="p-2 rounded-xl active:bg-gray-100 transition-colors"
                  aria-label="Search"
                >
                  <Search size={22} className={transparent ? 'text-white' : 'text-gray-700'} />
                </button>
              )}
              {showCart && (
                <button
                  onClick={onCart || (() => navigate('/cart'))}
                  className="relative p-2 rounded-xl active:bg-gray-100 transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart size={22} className={transparent ? 'text-white' : 'text-gray-700'} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
              )}
              {showNotification && (
                <button
                  onClick={onNotification || (() => navigate('/notifications'))}
                  className="relative p-2 rounded-xl active:bg-gray-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={22} className={transparent ? 'text-white' : 'text-gray-700'} />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
