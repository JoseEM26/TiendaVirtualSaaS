// components/ProductosList.tsx
import ProductoCard from './ProductoCard';

interface Producto {
  id: number;
  nombre: string;
  slug: string;
  precio: number;
  imagen_url?: string | null;
  stock?: number;
}

export default function ProductosList({ 
  productos = [], 
  tiendaSlug 
}: { 
  productos?: Producto[]; 
  tiendaSlug: string;
}) {
  if (productos.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-500 text-lg">No hay productos destacados aún.</p>
      </div>
    );
  }

  return (
    <>
      {productos.map((producto) => (
        <ProductoCard key={producto.id} producto={producto} tiendaSlug={tiendaSlug} />
      ))}
    </>
  );
}