// components/CategoriasList.tsx
import Link from 'next/link';
import { slugify } from '@/lib/slugify';

export default function CategoriasList({
  categorias,
  tiendaSlug,
}: {
  categorias: any[];
  tiendaSlug: string;
}) {
  if (!categorias.length) {
    return <p className="text-gray-500">No hay categorías.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {categorias.map((cat) => {
        const catSlug = cat.slug || slugify(cat.nombre);
        return (
          <Link
            key={cat.id}
            href={`/tiendas/${tiendaSlug}/categorias/${catSlug}`}
            className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-indigo-500 hover:shadow-md transition-all"
          >
            <p className="font-medium text-gray-800">{cat.nombre}</p>
          </Link>
        );
      })}
    </div>
  );
}