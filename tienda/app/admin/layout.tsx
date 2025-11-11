// app/admin/layout.tsx
'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/admin/AppSidebar';
import { Topbar } from '@/components/admin/Topbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full min-h-screen bg-gray-50">
          <Topbar />
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <SidebarTrigger className="lg:hidden mb-6" />
            {children}
          </div>
        </main>
      </SidebarProvider>
    </QueryClientProvider>
  );
}