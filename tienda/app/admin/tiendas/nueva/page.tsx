// app/admin/tiendas/nueva/page.tsx
import TiendaForm from '@/components/TiendaForm';
import { prisma } from '@/lib/prisma';

export default async function NuevaTiendaPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Crear Nueva Tienda</h1>
      <TiendaForm users={users} />
    </div>
  );
}