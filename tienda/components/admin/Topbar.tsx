// components/admin/Topbar.tsx
'use client';

import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export function Topbar() {
  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar tiendas, usuarios..."
            className="pl-10 bg-gray-50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}