import { Menu } from 'lucide-react';
import type { User } from '../types';

interface TopbarProps {
  user: User | null;
  onToggleSidebar?: () => void;
}

export function Topbar({ user, onToggleSidebar }: TopbarProps) {
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  return (
    <header className="fixed top-0 left-[220px] right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      {/* Hamburger */}
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Menu size={16} />
      </button>

      {/* User info */}
      <div className="flex items-center gap-3">
        <span className="text-base font-medium text-gray-700">{user?.name ?? 'Guest'}</span>
        <div className="w-8 h-8 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center select-none">
          {initials}
        </div>
      </div>
    </header>
  );
}
