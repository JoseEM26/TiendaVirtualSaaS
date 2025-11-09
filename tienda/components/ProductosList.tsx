// components/ProductosList.tsx
import Link from 'next/link';
import { slugify } from '@/lib/slugify';

export default function ProductosList({
  productos,
  tiendaSlug,
}: {
  productos: any[];
  tiendaSlug: string;
}) {
  if (!productos.length) {
    return <p className="text-gray-500 text-center py-12">No hay productos.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((p) => {
        const productoSlug = p.slug || slugify(p.nombre);
        return (
          <Link
            key={p.id}
            href={`/tiendas/${tiendaSlug}/productos/${productoSlug}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="aspect-w-1 aspect-h-1 bg-gray-200">
              {p.imagen_base64 ? (
                <img
                  src={p.imagen_base64}
                  alt={p.nombre}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800 group-hover:text-indigo-600">
                {p.nombre}
              </h3>
              <p className="text-2xl font-bold text-indigo-600 mt-1">
                ${Number(p.precio).toFixed(2)}  {/* CORREGIDO */}
              </p>
              <p className="text-sm text-gray-500">Stock: {p.stock}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}