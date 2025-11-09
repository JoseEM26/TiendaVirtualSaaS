// app/tiendas/[tiendaSlug]/productos/[productoSlug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { slugify } from '@/lib/slugify';

interface Props {
  params: Promise<{ tiendaSlug: string; productoSlug: string }>;
}

// SEO dinámico
export async function generateMetadata({ params }: Props) {
  const { tiendaSlug, productoSlug } = await params;

  const producto = await prisma.producto.findFirst({
    where: {
      activo: true,
      OR: [
        { slug: productoSlug },
        { nombre: { equals: productoSlug.replace(/-/g, ' '), mode: 'insensitive' } },
      ],
      Tienda: {
        OR: [
          { slug: tiendaSlug },
          { nombre: { equals: tiendaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
        ],
      },
    },
    select: { nombre: true, precio: true },
  });

  return {
    title: producto ? `${producto.nombre} - $${producto.precio}` : 'Producto no encontrado',
    description: producto?.nombre,
  };
}

export default async function ProductoDetalle({ params }: Props) {
  const { tiendaSlug, productoSlug } = await params; // AWAIT AQUÍ

  const producto = await prisma.producto.findFirst({
    where: {
      activo: true,
      OR: [
        { slug: productoSlug },
        { nombre: { equals: productoSlug.replace(/-/g, ' '), mode: 'insensitive' } },
      ],
      Tienda: {
        OR: [
          { slug: tiendaSlug },
          { nombre: { equals: tiendaSlug.replace(/-/g, ' '), mode: 'insensitive' } },
        ],
      },
    },
    include: {
      Categoria: true,
      Tienda: { select: { nombre: true, slug: true } },
    },
  });

  if (!producto) notFound();

  const tiendaSlugUrl = producto.Tienda.slug || slugify(producto.Tienda.nombre);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen */}
          <div>
            {producto.imagen_base64 ? (
              <img
                src={producto.imagen_base64}
                alt={producto.nombre}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
            )}
          </div>

          {/* Detalles */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{producto.nombre}</h1>

<p className="text-3xl font-bold text-indigo-600 mt-2">
  ${Number(producto.precio).toFixed(2)}  {/* CORREGIDO */}
</p>
            </div>

            <p className="text-gray-700">{producto.descripcion || 'Sin descripción.'}</p>

            <div className="space-y-2">
              <p><strong>Categoría:</strong> {producto.Categoria.nombre}</p>
              <p><strong>Talla:</strong> {producto.talla || 'N/A'}</p>
              <p><strong>Género:</strong> {producto.tipo_genero || 'Unisex'}</p>
              {/* <p>
                <strong>Stock:</strong>{' '}
                {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
              </p> */}
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Agregar al carrito
            </button>

            <a
              href={`/tiendas/${tiendaSlugUrl}`}
              className="block text-center text-indigo-600 hover:underline"
            >
              ← Volver a la tienda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}