// app/page.tsx
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  let tiendas = [];
  let error = null;

  try {
    const { prisma } = await import('@/lib/prisma');
    tiendas = await prisma.tienda.findMany({
      where: { estado: true },
      include: {
        _count: { select: { productos: true } }, // cambiado a 'productos'
      },
      orderBy: { created_at: 'desc' },
    });
  } catch (err) {
    console.error('Error cargando tiendas:', err);
    error = 'No se pudieron cargar las tiendas. Intenta más tarde.';
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0]?.toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          TuTienda SaaS
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Crea y gestiona tu tienda online en minutos. Sin complicaciones, sin código.
        </p>
        <div className="mt-8">
          <Link
            href="/admin/tiendas/nueva"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Crear Mi Tienda Gratis
          </Link>
        </div>
      </header>

      {/* Tiendas Activas */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Tiendas Activas
        </h2>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Recargar página
            </button>
          </div>
        ) : tiendas.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-gray-400">Store</span>
            </div>
            <p className="text-gray-500 text-lg">
              Aún no hay tiendas registradas. ¡Sé el primero en crear una!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tiendas.map((tienda) => (
              <Link
                key={tienda.id}
                href={`/tiendas/${tienda.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:from-blue-600 group-hover:to-blue-700 transition">
                    {getInitials(tienda.nombre)}
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">
                    {tienda.nombre}
                  </h3>

                  {tienda.descripcion && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {tienda.descripcion}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-3 font-medium">
                    {tienda._count.productos}{' '}
                    {tienda._count.productos === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-gray-50 border-t mt-16 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} TuTienda SaaS. Todos los derechos reservados.</p>
          <p className="mt-1">
            Hecho con <span className="text-red-500">Next.js</span> +{' '}
            <span className="text-green-600">Prisma</span> +{' '}
            <span className="text-blue-600">PostgreSQL</span>
          </p>
        </div>
      </footer>
    </div>
  );
}