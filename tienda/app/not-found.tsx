// app/not-found.tsx
import Link from 'next/link';
import { Home, Store } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6">
            <Store className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-2xl font-semibold text-gray-700 mb-2">
            Tienda no encontrada
          </p>
          <p className="text-gray-500">
            La tienda que buscas no existe o fue eliminada.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Crear mi tienda
          </Link>
        </div>
      </div>
    </div>
  );
}