// app/admin/tiendas/nueva/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function NuevaTiendaPage() {
  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/admin/tiendas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        slug: slug || nombre.toLowerCase().replace(/\s+/g, '-'),
        ownerId: 2, // ← ID del dueño (puedes tener un <select>)
      }),
    });

    if (res.ok) {
      router.push('/admin/tiendas');
    } else {
      alert('Error al crear tienda');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input
        placeholder="Nombre de la tienda"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <Input
        placeholder="Slug (opcional)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <Button type="submit">Crear Tienda</Button>
    </form>
  );
}