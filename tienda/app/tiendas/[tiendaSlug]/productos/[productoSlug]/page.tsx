// app/tiendas/[tiendaSlug]/productos/[productoSlug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { slugify } from '@/lib/slugify';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Store, ChevronLeft, ShoppingCart, CheckCircle, XCircle, Bell } from 'lucide-react';

interface Props {
  params: Promise<{ tiendaSlug: string; productoSlug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { tiendaSlug, productoSlug } = await params;

  const producto = await prisma.producto.findFirst({
    where: {
      activo: true,
      OR: [
        { slug: productoSlug },
        { nombre: { equals: productoSlug.replace(/-/g, ' '), mode: 'insensitive' } },
      ],
      tienda: {  // CORREGIDO
        OR: [
          { slug: tiendaSlug },
          { nombre: { equals: tiendaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
        ],
      },
    },
    select: {
      nombre: true,
      precio: true,
      descripcion: true,
      imagen_url: true,
      stock: true,
      tienda: { select: { nombre: true } },  // CORREGIDO
    },
  });

  if (!producto) return { title: 'Producto no encontrado' };

  return {
    title: `${producto.nombre} - S/ ${producto.precio.toFixed(2)} | ${producto.tienda.nombre}`,
    description: producto.descripcion || `Compra ${producto.nombre} en ${producto.tienda.nombre}`,
    openGraph: {
      title: producto.nombre,
      description: producto.descripcion || '',
      images: producto.imagen_url ? [{ url: producto.imagen_url }] : [],
    },
  };
}

export default async function ProductoDetalle({ params }: Props) {
  const { tiendaSlug, productoSlug } = await params;

  const producto = await prisma.producto.findFirst({
    where: {
      activo: true,
      OR: [
        { slug: productoSlug },
        { nombre: { equals: productoSlug.replace(/-/g, ' '), mode: 'insensitive' } },
      ],
      tienda: {
        OR: [
          { slug: tiendaSlug },
          { nombre: { equals: tiendaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
        ],
      },
    },
    select: {
      id: true,
      nombre: true,
      slug: true,
      descripcion: true,
      precio: true,
      imagen_url: true,
      talla: true,
      tipo_genero: true,
      stock: true,
      categoria: { select: { nombre: true } },  // CORREGIDO
      tienda: {
        select: { nombre: true, slug: true, whatsapp: true, logo_url: true },
      },
    },
  });

  if (!producto) notFound();

  const tiendaSlugUrl = producto.tienda.slug || slugify(producto.tienda.nombre);
  const whatsappMessage = encodeURIComponent(
    `¡Hola! Quiero comprar: *${producto.nombre}* - S/ ${producto.precio.toFixed(2)}\nStock: ${producto.stock} unidades\nEnlace: https://tutienda.com/tiendas/${tiendaSlugUrl}/productos/${producto.slug || producto.id}`
  );

  const stockPercentage = producto.stock > 0 ? Math.min((producto.stock / 50) * 100, 100) : 0;
  const isLowStock = producto.stock > 0 && producto.stock <= 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-indigo-600">Inicio</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href={`/tiendas/${tiendaSlugUrl}`} className="hover:text-indigo-600">
            {producto.tienda.nombre}
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{producto.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative group">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200">
              {producto.imagen_url ? (
                <Image src={producto.imagen_url} alt={producto.nombre} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" priority />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {producto.tienda.logo_url && (
              <div className="absolute top-4 left-4 w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                <Image src={producto.tienda.logo_url} alt={producto.tienda.nombre} width={64} height={64} className="object-cover" />
              </div>
            )}

            {isLowStock && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                ¡Solo {producto.stock} left!
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{producto.nombre}</h1>
              <p className="text-3xl font-bold text-indigo-600 mt-2">S/ {Number(producto.precio).toFixed(2)}</p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {producto.descripcion || 'Producto de alta calidad, ideal para tu estilo de vida.'}
            </p>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Categoría</p>
                <p className="font-medium flex items-center gap-1">
                  <Package className="w-4 h-4 text-indigo-600" />
                  {producto.categoria.nombre}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Talla</p>
                <p className="font-medium">{producto.talla || 'Talla única'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Género</p>
                <p className="font-medium">{producto.tipo_genero || 'Unisex'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock</p>
                <div className="space-y-1">
                  <p className="font-medium flex items-center gap-1">
                    {producto.stock > 0 ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">{producto.stock} disponibles</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">Agotado</span>
                      </>
                    )}
                  </p>
                  {producto.stock > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${producto.stock <= 5 ? 'bg-orange-500' : 'bg-green-500'}`}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                disabled={producto.stock === 0}
                className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                  producto.stock > 0 ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {producto.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
              </button>

              {producto.tienda.whatsapp && (
                <a
                  href={`https://wa.me/${producto.tienda.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.261c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Comprar por WhatsApp
                </a>
              )}

              {producto.stock === 0 && (
                <button className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg">
                  <Bell className="w-5 h-5" /> Notificarme cuando haya stock
                </button>
              )}
            </div>

            <Link href={`/tiendas/${tiendaSlugUrl}`} className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              <ChevronLeft className="w-5 h-5" /> Volver a la tienda
            </Link>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {producto.tienda.nombre}. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}