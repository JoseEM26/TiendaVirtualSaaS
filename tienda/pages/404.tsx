// pages/404.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-9xl font-bold text-gray-200 select-none">404</h1>
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-800">
            ¡Ups!
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-medium text-gray-900">
            Página no encontrada
          </h2>
          <p className="text-gray-600">
            La página que estás buscando no existe o fue movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto flex items-center gap-2">
              <Home className="w-4 h-4" />
              Ir al inicio
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
}