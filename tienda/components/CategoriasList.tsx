// components/CategoriasList.tsx
'use client';
import Link from 'next/link';
import { Package, AlertCircle } from 'lucide-react';
import { slugify } from '@/lib/slugify';

interface Categoria {
  id: number;
  nombre: string;
  slug: string | null;
  _count?: {
    productos: number; // CORREGIDO: Producto → productos
  };
}

export default function CategoriasList({
  categorias,
  tiendaSlug
}: {
  categorias: Categoria[];
  tiendaSlug: string;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {categorias.map((cat) => {
        const totalProductos = cat._count?.productos || 0; // CORREGIDO
        const isLowStock = totalProductos > 0 && totalProductos <= 3;

        return (
          <Link
            key={cat.id}
            href={`/tiendas/${tiendaSlug}/categorias/${cat.slug || slugify(cat.nombre)}`}
            className="group relative flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
          >
            {isLowStock && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3 h-3" />
                {totalProductos}
              </div>
            )}

            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Package className="w-8 h-8 text-indigo-600" />
            </div>

            <span className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors text-center line-clamp-2">
              {cat.nombre}
            </span>

            <span className={`text-xs mt-1 flex items-center gap-1 ${
              isLowStock ? 'text-orange-600 font-bold' : 'text-gray-500'
            }`}>
              {totalProductos} {totalProductos === 1 ? 'producto' : 'productos'}
            </span>
          </Link>
        );
      })}
    </div>
  );
}