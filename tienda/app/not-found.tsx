'use client'; 

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 grande */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-gray-200 select-none">404</h1>
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-800">
            ¡Ups!
          </p>
        </div>

        {/* Mensaje */}
        <div className="space-y-2">
          <h2 className="text-2xl font-medium text-gray-900">
            Página no encontrada
          </h2>
          <p className="text-gray-600">
            La página que estás buscando no existe o fue movida.
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Home className="w-4 h-4" />
              Ir al inicio
            </button>
          </Link>

          <button
            onClick={() => window.history.back()} // ← Ahora funciona aquí
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}