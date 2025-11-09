// app/tiendas/[tiendaSlug]/productos/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductosList from '@/components/ProductosList';
import { slugify } from '@/lib/slugify';

export default async function ProductosPage({ params }: { params: { tiendaSlug: string } }) {
  const { tiendaSlug } = params;

  const tienda = await prisma.tienda.findFirst({
    where: {
      OR: [
        { slug: tiendaSlug },
        { nombre: { equals: tiendaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
        { id: isNaN(Number(tiendaSlug)) ? undefined : Number(tiendaSlug) },
      ],
    },
    include: {
      Producto: {
        where: { activo: true },
        orderBy: { created_at: 'desc' },
        include: { Categoria: true },
      },
    },
  });

  if (!tienda) notFound();

  const tiendaSlugUrl = tienda.slug || slugify(tienda.nombre);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Todos los productos de {tienda.nombre}
        </h1>
        <ProductosList productos={tienda.Producto} tiendaSlug={tiendaSlugUrl} />
      </div>
    </div>
  );
}