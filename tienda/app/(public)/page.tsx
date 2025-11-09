// app/(public)/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const tiendas = await prisma.tienda.findMany({
    where: { estado: true },
    include: { _count: { select: { Producto: true } } },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Elige tu tienda</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiendas.map((t) => (
            <Link
              key={t.id}
              href={`/tiendas/${t.slug || t.id}`}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold">{t.nombre}</h2>
              <p className="text-gray-600">{t.Producto.length} productos</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}