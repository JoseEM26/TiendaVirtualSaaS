// app/admin/users/page.tsx (modified for inline form)
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { UsersTable } from '@/components/UsersTable';
import { UserForm } from '@/components/UserForm';
import { fetchUsers } from '@/lib/api/users';
import { Loader2, Plus } from 'lucide-react';

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    console.log('UsersPage rendered on client');
  }, []);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Gestión de Usuarios
        </h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" /> {showForm ? 'Ocultar Formulario' : 'Crear Usuario'}
        </Button>
      </div>
      {showForm && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Crear Usuario</h2>
          <UserForm onSuccess={() => setShowForm(false)} />
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500">Error al cargar usuarios: {(error as Error).message}</p>
      ) : (
        <UsersTable users={users || []} />
      )}
    </div>
  );
}