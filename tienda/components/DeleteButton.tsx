// components/DeleteButton.tsx
'use client';

import { Trash2 } from 'lucide-react';

type Props = {
  tiendaId: number;
};

export default function DeleteButton({ tiendaId }: Props) {
  const handleDelete = (e: React.MouseEvent) => {
    if (!confirm('¿Estás seguro de eliminar esta tienda?')) {
      e.preventDefault();
    }
  };

  return (
    <form action={`/api/tiendas/${tiendaId}`} method="POST">
      <input name="_method" value="DELETE" type="hidden" />
      <button
        type="submit"
        onClick={handleDelete}
        className="w-full bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition flex items-center justify-center gap-1"
      >
        <Trash2 className="w-4 h-4" />
        Eliminar
      </button>
    </form>
  );
}