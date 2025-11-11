// app/admin/tiendas/[id]/page.tsx
import TiendaForm from '@/components/TiendaForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';

export default async function EditarTiendaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tiendaId = Number(id);
  if (isNaN(tiendaId)) notFound();

  const [tienda, users] = await Promise.all([
    prisma.tienda.findUnique({
      where: { id: tiendaId },
      include: { User: { select: { id: true, name: true, email: true } } },
    }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!tienda) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Edit className="w-6 h-6" />
            Editar Tienda: {tienda.nombre}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TiendaForm tienda={tienda} users={users} />
        </CardContent>
      </Card>
    </div>
  );
}