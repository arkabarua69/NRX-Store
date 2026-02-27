import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationCount } from '@/hooks/useNotificationCount';
import UserNotificationPanel from './UserNotificationPanel';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotificationCount();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <Bell size={20} className="text-gray-700" />
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <UserNotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
