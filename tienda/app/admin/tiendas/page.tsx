// app/admin/tiendas/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TiendaCard } from '@/components/admin/TiendaCard';

export default async function AdminTiendasPage() {
  const tiendas = await prisma.tienda.findMany({
    select: {
      id: true,
      nombre: true,
      slug: true,
      estado: true,
      User: { select: { name: true, email: true } },
      _count: { select: { Producto: true, Categoria: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tiendas</h1>
          <p className="text-gray-600 mt-1">Gestiona todas las tiendas del sistema</p>
        </div>
        <Link href="/admin/tiendas/nueva">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Tienda
          </Button>
        </Link>
      </div>

      {tiendas.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No hay tiendas registradas</p>
            <Link href="/admin/tiendas/nueva">
              <Button variant="outline">Crear primera tienda</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiendas.map((tienda) => (
            <TiendaCard key={tienda.id} tienda={tienda} />
          ))}
        </div>
      )}
    </div>
  );
}