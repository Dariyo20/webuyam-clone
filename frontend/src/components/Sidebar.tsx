import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  Package,
  Users,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  badge?: number;
  chevron?: boolean;
}

export function Sidebar() {
  const { data: cart } = useCart();
  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const navItems: NavItem[] = [
    { label: 'Home', to: '/dashboard/home', icon: <Home size={18} /> },
    { label: 'Shop', to: '/dashboard/shop', icon: <ShoppingBag size={18} /> },
    {
      label: 'Cart',
      to: '/dashboard/cart',
      icon: <ShoppingCart size={18} />,
      badge: cartCount,
    },
    {
      label: 'Orders',
      to: '/dashboard/orders',
      icon: <ClipboardList size={18} />,
      chevron: true,
    },
    { label: 'Combo', to: '/dashboard/combo', icon: <Package size={18} /> },
    { label: 'Group', to: '/dashboard/group', icon: <Users size={18} /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-[220px] bg-sidebar flex flex-col z-20">
      {/* Logo */}
      <div className="flex items-center px-5 py-5">
        <span className="text-xl font-extrabold text-gray-900 tracking-tight">WE</span>
        <span className="ml-1 bg-green-600 text-white text-xl font-extrabold px-2 py-0.5 rounded-md tracking-tight">
          BUY
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:bg-green-50 hover:text-gray-900'
              }`
            }
          >
            <span className="flex items-center gap-3">
              {item.icon}
              {item.label}
            </span>
            <span className="flex items-center gap-1">
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
              {item.chevron && <ChevronRight size={14} className="text-gray-400" />}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
