// app/tiendas/[tiendaSlug]/productos/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductosList from '@/components/ProductosList';
import { slugify } from '@/lib/slugify';
import Image from 'next/image';
import Link from 'next/link';
import { Package, ChevronLeft, Filter, Store } from 'lucide-react';
import SortSelect from '@/components/SortSelect';
import Pagination from '@/components/Pagination';

interface Props {
  params: Promise<{ tiendaSlug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { tiendaSlug } = await params;

  const tienda = await prisma.tienda.findFirst({
    where: {
      OR: [
        { slug: tiendaSlug },
        { nombre: { equals: tiendaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
      ],
    },
    select: { nombre: true, descripcion: true, logo_url: true },
  });

  if (!tienda) return { title: 'Tienda no encontrada' };

  return {
    title: `Todos los productos | ${tienda.nombre} - TuTienda.pe`,
    description: tienda.descripcion || `Explora todos los productos de ${tienda.nombre}. Envíos a todo Perú.`,
    openGraph: {
      title: `Productos | ${tienda.nombre}`,
      description: `Envíos a Lima, Arequipa, Cusco y todo Perú.`,
      images: tienda.logo_url ? [{ url: tienda.logo_url }] : [],
      locale: 'es_PE',
    },
  };
}

export default async function ProductosPage({ params, searchParams }: Props) {
  const { tiendaSlug } = await params;
  const { page = '1', sort = 'nuevo' } = await searchParams;
  const currentPage = Math.max(1, parseInt(page) || 1);
  const pageSize = 20;

  const tienda = await prisma.tienda.findFirst({
    where: {
      OR: [
        { slug: tiendaSlug },
        { nombre: { equals: tiendaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
      ],
      estado: true,
    },
    include: {
      _count: {
        select: {
          productos: {  // CORREGIDO
            where: { activo: true },
          },
        },
      },
      productos: {  // CORREGIDO
        where: { activo: true },
        orderBy: getSortOrder(sort),
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          nombre: true,
          slug: true,
          precio: true,
          imagen_url: true,
          stock: true,
          talla: true,
          tipo_genero: true,
          categoria: { select: { nombre: true } },  // CORREGIDO
        },
      },
    },
  });

  if (!tienda) notFound();

  const tiendaSlugUrl = tienda.slug || slugify(tienda.nombre);
  const totalProductos = tienda._count?.productos || 0;
  const totalPages = Math.ceil(totalProductos / pageSize);
  const stockTotal = tienda.productos.reduce((sum, p) => sum + (p.stock || 0), 0);

  const categorias = [...new Set(tienda.productos.map(p => p.categoria.nombre))].sort();
  const tallas = [...new Set(tienda.productos.map(p => p.talla).filter(Boolean))].sort();
  const generos = [...new Set(tienda.productos.map(p => p.tipo_genero).filter(Boolean))].sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-indigo-600">Inicio</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href={`/tiendas/${tiendaSlugUrl}`} className="hover:text-indigo-600">
            {tienda.nombre}
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Todos los productos</span>
        </nav>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            {tienda.logo_url && (
              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                <Image src={tienda.logo_url} alt={tienda.nombre} width={64} height={64} className="object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Todos los productos</h1>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <Store className="w-4 h-4" />
                {totalProductos} {totalProductos === 1 ? 'producto' : 'productos'} • {stockTotal} en stock
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {(categorias.length > 0 || tallas.length > 0 || generos.length > 0) && (
              <details className="dropdown">
                <summary className="btn btn-outline btn-sm flex items-center gap-1">
                  <Filter className="w-4 h-4" /> Filtros
                </summary>
                <div className="dropdown-content bg-white p-4 rounded-xl shadow-lg z-10 w-72 space-y-4">
                  {categorias.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-2">Categoría</p>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {categorias.map(cat => (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="checkbox checkbox-xs checkbox-primary" />
                            <span className="text-sm">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {tallas.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-2">Talla</p>
                      <div className="space-y-1">
                        {tallas.map(t => (
                          <label key={t} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="checkbox checkbox-xs checkbox-primary" />
                            <span className="text-sm">{t}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {generos.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-2">Género</p>
                      <div className="space-y-1">
                        {generos.map(g => (
                          <label key={g} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="checkbox checkbox-xs checkbox-primary" />
                            <span className="text-sm">{g}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </details>
            )}
            <SortSelect defaultValue={sort} />
          </div>
        </div>

        {totalProductos > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <ProductosList productos={tienda.productos} tiendaSlug={tiendaSlugUrl} />
            </div>
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} sort={sort} />
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No hay productos disponibles en esta tienda.</p>
            <Link href={`/tiendas/${tiendaSlugUrl}`} className="mt-4 inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium">
              <ChevronLeft className="w-4 h-4" /> Volver a la tienda
            </Link>
          </div>
        )}

        {tienda.whatsapp && (
          <a
            href={`https://wa.me/${tienda.whatsapp.replace(/\D/g, '')}?text=¡Hola!%20Quiero%20ver%20todos%20los%20productos%20(${totalProductos}%20disponibles)`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.261c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

function getSortOrder(sort: string) {
  switch (sort) {
    case 'precio-asc': return { precio: 'asc' };
    case 'precio-desc': return { precio: 'desc' };
    case 'stock': return { stock: 'desc' };
    default: return { created_at: 'desc' };
  }
}