// app/tiendas/[tiendaSlug]/categorias/[categoriaSlug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductosList from '@/components/ProductosList';
import { slugify } from '@/lib/slugify';

interface Props {
  params: Promise<{ tiendaSlug: string; categoriaSlug: string }>;
}

// SEO dinámico
export async function generateMetadata({ params }: Props) {
  const { categoriaSlug } = await params;

  const categoria = await prisma.categoria.findFirst({
    where: {
      activa: true,
      OR: [
        { slug: categoriaSlug },
        { nombre: { equals: categoriaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
      ],
    },
    select: { nombre: true },
  });

  return {
    title: categoria ? `${categoria.nombre} | TuTienda` : 'Categoría no encontrada',
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { tiendaSlug, categoriaSlug } = await params; // AWAIT AQUÍ

  const categoria = await prisma.categoria.findFirst({
    where: {
      activa: true,
      OR: [
        { slug: categoriaSlug },
        { nombre: { equals: categoriaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
      ],
      Tienda: {
        OR: [
          { slug: tiendaSlug },
          { nombre: { equals: tiendaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
        ],
      },
    },
    include: {
      Producto: {
        where: { activo: true },
        orderBy: { created_at: 'desc' },
      },
      Tienda: { select: { slug: true, nombre: true } },
    },
  });

  if (!categoria) notFound();

  const tiendaSlugUrl = categoria.Tienda.slug || slugify(categoria.Tienda.nombre);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoria.nombre}
        </h1>
        <p className="text-gray-600 mb-8">
          {categoria.Producto.length} productos en esta categoría
        </p>
        <ProductosList productos={categoria.Producto} tiendaSlug={tiendaSlugUrl} />
      </div>
    </div>
  );
}