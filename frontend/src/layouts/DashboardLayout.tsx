import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useAuthStore } from '../stores/authStore';

export function DashboardLayout() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <Topbar user={user} />
      <main className="ml-[220px] pt-14 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
