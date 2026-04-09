import { Square } from 'lucide-react';
import type { User } from '../types';

interface TopbarProps {
  user: User | null;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Topbar({ user, sidebarOpen, onToggleSidebar }: TopbarProps) {
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  return (
    <header
      className={`fixed top-0 right-0 z-10 flex items-center justify-between py-2 px-4 md:px-[25px] bg-white shadow-lg font-raleway transition-all duration-300 ${
        sidebarOpen ? 'md:left-[220px] left-0' : 'left-0'
      }`}
    >
      {/* Sidebar toggle — pulsing ring + Square icon */}
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="relative flex-shrink-0"
      >
        <span
          className="absolute inset-0 rounded-full bg-[#0D5F07] opacity-75 animate-ping-slow"
          aria-hidden="true"
        />
        <span className="relative z-10 flex items-center justify-center w-10 h-10 border-2 border-[#0D5F07] rounded-full bg-white hover:bg-gray-50 transition-colors">
          <Square size={16} strokeWidth={2} className="text-[#0D5F07]" />
        </span>
      </button>

      {/* User info */}
      <div className="flex items-center gap-3">
        <span className="text-base font-medium text-gray-700">{user?.name ?? 'Guest'}</span>
        <div className="w-8 h-8 rounded-full bg-[#0D5F07] text-white text-xs font-bold flex items-center justify-center select-none">
          {initials}
        </div>
      </div>
    </header>
  );
}
