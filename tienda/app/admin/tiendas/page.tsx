// app/admin/tiendas/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Edit, Plus } from 'lucide-react';
import DeleteButton from '@/components/DeleteButton';
import ReloadButton from '@/components/ReloadButton';

export default async function AdminTiendasPage() {
  const tiendas = await prisma.tienda.findMany({
    include: {
      User: { select: { name: true, email: true } },
      _count: { select: { Producto: true, Categoria: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Tiendas</h1>
        <Link
          href="/admin/tiendas/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nueva Tienda
        </Link>
      </div>

      {tiendas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay tiendas registradas.</p>
          <Link
            href="/admin/tiendas/nueva"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Crear la primera tienda
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiendas.map((tienda) => (
            <div
              key={tienda.id}
              className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-900">{tienda.nombre}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    tienda.estado
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {tienda.estado ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Dueño: {tienda.User.name} ({tienda.User.email})
              </p>

              <div className="flex gap-2 text-xs text-gray-500 mb-4">
                <span>{tienda._count.Producto} productos</span>
                <span>•</span>
                <span>{tienda._count.Categoria} categorías</span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/tiendas/${tienda.id}`}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-center text-sm font-medium hover:bg-gray-200 transition flex items-center justify-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </Link>
                <DeleteButton tiendaId={tienda.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}