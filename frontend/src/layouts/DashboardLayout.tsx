import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useAuthStore } from '../stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { ApiResponse, Cart } from '../types';

function useCartCount(): number {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data } = useQuery<ApiResponse<Cart>>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Cart>>('/api/cart');
      return res.data;
    },
    enabled: isAuthenticated,
  });
  const items = data?.data?.items ?? [];
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function DashboardLayout() {
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartCount();

  return (
    <div className="min-h-screen bg-white">
      <Sidebar cartCount={cartCount} />
      <Topbar user={user} />
      <main className="ml-[220px] pt-14 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
