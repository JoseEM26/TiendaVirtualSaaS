// app/tiendas/[tiendaSlug]/productos/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductosList from '@/components/ProductosList';

interface Props {
  params: Promise<{ tiendaSlug: string }>;
}

export default async function ProductosPage({ params }: Props) {
  const { tiendaSlug } = await params;

  // VALIDACIÓN SEGURA
  if (!tiendaSlug) notFound();

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

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Todos los productos de {tienda.nombre}
        </h1>
        <ProductosList productos={tienda.Producto} tiendaSlug={tienda.slug!} />
      </div>
    </div>
  );
}