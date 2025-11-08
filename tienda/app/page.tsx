// app/page.tsx
import Image from "next/image";

interface Producto {
  id: number;
  nombre: string;
  precio: string;
  talla: string;
  tipo_genero: string;
  imagen_base64: string | null;
  Categoria: { nombre: string };
  Tienda: { nombre: string; logo_url: string };
}

async function getProductos() {
  const res = await fetch("http://localhost:3000/api/productos", {
    cache: "no-store",
  });
  return res.json() as Promise<Producto[]>;
}

export default async function Home() {
  const productos = await getProductos();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Descubre Nuestros Productos
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Calidad, estilo y comodidad en cada prenda
        </p>
      </section>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Imagen */}
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
              {producto.imagen_base64 ? (
                <Image
                  src={producto.imagen_base64}
                  alt={producto.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700 rounded-xl w-32 h-32 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {producto.nombre.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow">
                {producto.talla}
              </div>
            </div>

            {/* Info */}
            <div className="p-5 space-y-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                  {producto.nombre}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {producto.Categoria.nombre}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  S/ {producto.precio}
                </span>
                <button className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition group">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                
                <span>{producto.Tienda.nombre}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}