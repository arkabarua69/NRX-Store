import { ArrowLeft, MoreVertical, Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotification?: boolean;
  showMenu?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  onNotification?: () => void;
  onMenu?: () => void;
  transparent?: boolean;
  className?: string;
}

export default function MobileHeader({
  title,
  showBack = false,
  showSearch = false,
  showNotification = false,
  showMenu = false,
  onBack,
  onSearch,
  onNotification,
  onMenu,
  transparent = false,
  className = '',
}: MobileHeaderProps) {
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
      className={`fixed top-0 left-0 right-0 z-40 safe-area-top ${
        transparent 
          ? 'bg-transparent' 
          : 'bg-white border-b border-gray-200 shadow-sm'
      } ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft size={24} className={transparent ? 'text-white' : 'text-gray-900'} />
            </button>
          )}
          {title && (
            <h1 className={`text-lg font-black truncate ${transparent ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h1>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          {showSearch && (
            <button
              onClick={onSearch}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
              aria-label="Search"
            >
              <Search size={22} className={transparent ? 'text-white' : 'text-gray-700'} />
            </button>
          )}
          {showNotification && (
            <button
              onClick={onNotification}
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
              aria-label="Notifications"
            >
              <Bell size={22} className={transparent ? 'text-white' : 'text-gray-700'} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          )}
          {showMenu && (
            <button
              onClick={onMenu}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
              aria-label="Menu"
            >
              <MoreVertical size={22} className={transparent ? 'text-white' : 'text-gray-700'} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
