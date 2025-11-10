// components/ProductoCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface ProductoCardProps {
  producto: {
    id: number;
    nombre: string;
    slug: string;
    precio: number;
    imagen_url?: string | null;
    stock?: number;
  };
  tiendaSlug: string;
}

export default function ProductoCard({ producto, tiendaSlug }: ProductoCardProps) {
  const isLowStock = producto.stock != null && producto.stock > 0 && producto.stock <= 3;

  return (
    <Link
      href={`/tiendas/${tiendaSlug}/productos/${producto.slug || producto.id}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      <div className="aspect-square relative bg-gray-100">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            ¡Solo {producto.stock}!
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2">
          {producto.nombre}
        </h3>
        <p className="text-lg font-bold text-indigo-600 mt-1">
          S/ {producto.precio.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}