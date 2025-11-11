// components/admin/TiendaCard.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit, Users, Package, Store } from 'lucide-react';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

type Tienda = {
  id: number;
  nombre: string;
  slug: string;
  estado: boolean;
  User: { name: string; email: string };
  _count: { Producto: number; Categoria: number };
};

interface TiendaCardProps {
  tienda: Tienda;
}

export function TiendaCard({ tienda }: TiendaCardProps) {
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Evitar que el click en botones abra la tienda
    if ((e.target as HTMLElement).closest('a, button')) return;
    window.open(`/tiendas/${tienda.slug}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors flex items-center gap-1">
            {tienda.nombre}
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <Badge variant={tienda.estado ? 'default' : 'secondary'}>
            {tienda.estado ? 'Activa' : 'Inactiva'}
          </Badge>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {tienda.User.name}
          </p>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {tienda._count.Producto} productos
            </span>
            <span className="flex items-center gap-1">
              <Store className="w-3 h-3" />
              {tienda._count.Categoria} categorías
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/admin/tiendas/${tienda.id}`}
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
          </Link>
          <DeleteButton
            tiendaId={tienda.id}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
        </div>

        <div className="flex items-center gap-1 text-xs text-blue-600 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-3 h-3" />
          <span>Ver tienda pública</span>
        </div>
      </CardContent>
    </Card>
  );
}