// components/TiendaForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slugify';

type User = { id: number; name: string; email: string };
type Tienda = {
  id?: number;
  nombre: string;
  slug?: string;
  descripcion?: string;
  logo_url?: string;
  ubicacion?: string;
  whatsapp?: string;
  email_contacto?: string;
  estado?: boolean;
  owner_id: number;
};

type Props = {
  tienda?: Tienda;
  users: User[];
};

export default function TiendaForm({ tienda, users }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Tienda>({
    nombre: tienda?.nombre || '',
    descripcion: tienda?.descripcion || '',
    logo_url: tienda?.logo_url || '',
    ubicacion: tienda?.ubicacion || '',
    whatsapp: tienda?.whatsapp || '',
    email_contacto: tienda?.email_contacto || '',
    estado: tienda?.estado ?? true,
    owner_id: tienda?.owner_id || users[0]?.id || 0,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = tienda ? 'PUT' : 'POST';
    const url = tienda ? `/api/tiendas/${tienda.id}` : '/api/tiendas';
    const body = { ...form, slug: slugify(form.nombre) };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push('/admin/tiendas');
        router.refresh();
      } else {
        alert('Error al guardar');
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la tienda
        </label>
        <input
          type="text"
          required
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dueño
        </label>
        <select
          required
          value={form.owner_id}
          onChange={(e) => setForm({ ...form, owner_id: Number(e.target.value) })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          rows={3}
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp
          </label>
          <input
            type="text"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="+51 999 999 999"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email de contacto
          </label>
          <input
            type="email"
            value={form.email_contacto}
            onChange={(e) => setForm({ ...form, email_contacto: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.checked })}
            className="rounded text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Tienda activa</span>
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Guardando...' : tienda ? 'Actualizar' : 'Crear Tienda'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}