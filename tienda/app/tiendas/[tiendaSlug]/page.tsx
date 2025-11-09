// app/tiendas/[tiendaSlug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductosList from '@/components/ProductosList';
import CategoriasList from '@/components/CategoriasList';
import { slugify } from '@/lib/slugify';

interface Props {
params: Promise<{ tiendaSlug: string }>; // ← PROMISE
}

export default async function TiendaDashboard({ params }: Props) {
const { tiendaSlug } = await params; // ← AWAIT AQUÍ
  // Busca por slug, nombre o ID
  const tienda = await prisma.tienda.findFirst({
    where: {
      OR: [
        { slug: tiendaSlug },
        { nombre: { equals: tiendaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
        { id: isNaN(Number(tiendaSlug)) ? undefined : Number(tiendaSlug) },
      ],
      estado: true,
    },
    include: {
      User: { select: { name: true } },
      Categoria: {
        where: { activa: true },
        orderBy: { nombre: 'asc' },
      },
      Producto: {
        where: { activo: true },
        orderBy: { created_at: 'desc' },
        take: 6,
      },
    },
  });

  if (!tienda) notFound();

  const tiendaSlugUrl = tienda.slug || slugify(tienda.nombre);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {tienda.logo_url ? (
              <img
                src={tienda.logo_url}
                alt={tienda.nombre}
                className="w-16 h-16 rounded-full object-cover border"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {tienda.nombre[0].toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tienda.nombre}</h1>
              <p className="text-gray-600">{tienda.descripcion || 'Tienda increíble'}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        {/* Categorías */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categorías</h2>
          <CategoriasList categorias={tienda.Categoria} tiendaSlug={tiendaSlugUrl} />
        </section>

        {/* Productos destacados */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Productos Destacados</h2>
            <a
              href={`/tiendas/${tiendaSlugUrl}/productos`}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Ver todos →
            </a>
          </div>
          <ProductosList productos={tienda.Producto} tiendaSlug={tiendaSlugUrl} />
        </section>
      </main>
    </div>
  );
}

// SEO dinámico
export async function generateMetadata({ params }: Props) {
  const { tiendaSlug } = await params;
  const tienda = await prisma.tienda.findFirst({
    where: {
      OR: [
        { slug: tiendaSlug },
        { nombre: { equals: tiendaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
      ],
    },
    select: { nombre: true, descripcion: true },
  });

  return {
    title: tienda ? `${tienda.nombre} | TuTienda` : 'Tienda no encontrada',
    description: tienda?.descripcion || 'Explora productos increíbles',
  };
}