import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  badge?: number;
}

export default function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = 'primary',
  position = 'bottom-right',
  badge,
}: ActionButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-red-500 to-pink-500',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  };

  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
  };

  return (
    <button
      onClick={onClick}
      className={`fab ${variantClasses[variant]} ${positionClasses[position]}`}
      aria-label={label}
    >
      <Icon size={24} />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-red-500 rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-lg">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}
