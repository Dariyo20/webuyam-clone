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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Home',   to: '/dashboard/home',   icon: <Home         size={20} strokeWidth={2} /> },
  { label: 'Shop',   to: '/dashboard/shop',   icon: <ShoppingBag  size={20} strokeWidth={2} /> },
  { label: 'Cart',   to: '/dashboard/cart',   icon: <ShoppingCart size={20} strokeWidth={2} />, hasBadge: true },
  { label: 'Orders', to: '/dashboard/orders', icon: <ClipboardList size={20} strokeWidth={2} />, chevron: true },
  { label: 'Combo',  to: '/dashboard/combo',  icon: <Package      size={20} strokeWidth={2} /> },
  { label: 'Group',  to: '/dashboard/group',  icon: <Users        size={20} strokeWidth={2} /> },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data: cart } = useCart();
  const cartCount = cart?.items.length ?? 0;

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-[220px] bg-sidebar flex flex-col z-20 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center px-5 py-5">
        <span className="text-xl font-extrabold text-gray-900 tracking-tight">WE</span>
        <span className="ml-1 bg-[#0D5F07] text-white text-xl font-extrabold px-2 py-0.5 rounded-md tracking-tight">
          BUY
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={() => {
              // Close sidebar on mobile when navigating
              if (window.innerWidth < 768) onClose();
            }}
            className={({ isActive }) =>
              `flex items-center justify-between border-l-4 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive
                  ? 'bg-[#d4e8d0] text-[#0D5F07] border-[#0D5F07]'
                  : 'text-gray-600 border-transparent hover:bg-green-50 hover:text-gray-900'
              }`
            }
          >
            {/* Left: icon + label + badge (Cart only) */}
            <span className="flex items-center gap-3">
              {item.icon}
              {item.label}
              {item.hasBadge && cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>

            {/* Right: chevron (Orders only) */}
            {item.chevron && (
              <ChevronRight size={14} className="text-gray-400" />
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
