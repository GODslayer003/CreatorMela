import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useAppSelector } from '@/hooks/useRedux';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CommandPalette } from '@/components/common/CommandPalette';

export function DashboardLayout() {
  const { sidebarCollapsed } = useAppSelector((state) => state.ui);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div
          className="transition-all duration-200"
          style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        >
          <Topbar />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
        <CommandPalette />
      </div>
    </TooltipProvider>
  );
}
