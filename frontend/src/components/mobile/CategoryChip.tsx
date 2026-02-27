import { LucideIcon } from 'lucide-react';

interface CategoryChipProps {
  id: string;
  name: string;
  icon: LucideIcon;
  active?: boolean;
  onClick: (id: string) => void;
  color?: string;
}

export default function CategoryChip({
  id,
  name,
  icon: Icon,
  active = false,
  onClick,
  color = 'bg-gradient-to-r from-red-500 to-pink-500',
}: CategoryChipProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all active:scale-95 ${
        active
          ? `${color} text-white shadow-lg`
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
      }`}
    >
      <Icon size={16} />
      <span>{name}</span>
    </button>
  );
}
