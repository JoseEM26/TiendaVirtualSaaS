// app/admin/tiendas/[id]/page.tsx
import TiendaForm from '@/components/TiendaForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditarTiendaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Unwrap the Promise
  const tiendaId = Number(id);
  if (isNaN(tiendaId)) notFound();

  const tienda = await prisma.tienda.findUnique({
    where: { id: tiendaId },
    include: { User: { select: { id: true, name: true, email: true } } },
  });

  if (!tienda) notFound();

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Tienda</h1>
      <TiendaForm tienda={tienda} users={users} />
    </div>
  );
}