// components/admin/AppSidebar.tsx
'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, SidebarFooter } from '@/components/ui/sidebar';
import { Home, Store, Users, Settings, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/admin' },
  { icon: Store, label: 'Tiendas', href: '/admin/tiendas' },
  { icon: Users, label: 'Usuarios', href: '/admin/usuarios' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">Admin</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <div className="space-y-1 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition w-full">
          <LogOut className="w-5 h-5" />
          <span>Cerrar sesión</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}