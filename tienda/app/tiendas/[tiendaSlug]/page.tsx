// app/tiendas/[tiendaSlug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductosList from '@/components/ProductosList';
import CategoriasList from '@/components/CategoriasList';
import { slugify } from '@/lib/slugify';
import { Store, Package, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  params: Promise<{ tiendaSlug: string }>;
}

export default async function TiendaDashboard({ params }: Props) {
  const { tiendaSlug } = await params;

  const tienda = await prisma.tienda.findFirst({
    where: {
      OR: [
        { slug: tiendaSlug },
        { nombre: { equals: tiendaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
      ],
      estado: true,
    },
    include: {
      categorias: {  // CORREGIDO
        where: { activa: true },
        orderBy: { nombre: 'asc' },
        select: {
          id: true,
          nombre: true,
          slug: true,
          _count: {
            select: {
              productos: {  // CORREGIDO: Producto → productos
                where: { activo: true },
              },
            },
          },
        },
      },
      productos: {  // CORREGIDO
        where: { activo: true, destacado: true },
        orderBy: { created_at: 'desc' },
        take: 6,
        select: {
          id: true,
          nombre: true,
          slug: true,
          precio: true,
          imagen_url: true,
          stock: true,
        },
      },
      User: {
        select: { name: true },
      },
    },
  });

  if (!tienda) notFound();

  const tiendaSlugUrl = tienda.slug || slugify(tienda.nombre);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              {tienda.logo_url ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-indigo-100 group-hover:ring-indigo-200 transition-all">
                  <Image
                    src={tienda.logo_url}
                    alt={tienda.nombre}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-indigo-100">
                  {tienda.nombre[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                {tienda.nombre}
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-2xl">
                {tienda.descripcion || 'Descubre productos únicos y de calidad'}
              </p>
              {tienda.User?.name && (
                <p className="mt-1 text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                  <Store className="w-4 h-4" />
                  Gestionado por <span className="font-medium">{tienda.User.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {/* Categorías */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600" />
              Categorías
            </h2>
            {tienda.categorias.length > 4 && (
              <Link
                href={`/tiendas/${tiendaSlugUrl}/categorias`}
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 transition-colors"
              >
                Ver todas
              </Link>
            )}
          </div>
          <CategoriasList categorias={tienda.categorias} tiendaSlug={tiendaSlugUrl} />
        </section>

        {/* Productos Destacados */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Star className="w-7 h-7 text-yellow-500" />
              Productos Destacados
            </h2>
            <Link
              href={`/tiendas/${tiendaSlugUrl}/productos`}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
            >
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            <ProductosList productos={tienda.productos} tiendaSlug={tiendaSlugUrl} />
          </div>
        </section>
      </main>

      {/* WhatsApp Flotante */}
      {tienda.whatsapp && (
        <a
          href={`https://wa.me/${tienda.whatsapp.replace(/\D/g, '')}?text=¡Hola!%20Quiero%20ver%20más%20de%20*${encodeURIComponent(tienda.nombre)}*%20(${tienda.productos.length}%20destacados)`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
          aria-label="Contactar por WhatsApp"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.261c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </a>
      )}

      <footer className="mt-20 py-8 text-center text-sm text-gray-500 border-t border-gray-200 bg-white/50 backdrop-blur">
        <p>© {new Date().getFullYear()} {tienda.nombre}. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}