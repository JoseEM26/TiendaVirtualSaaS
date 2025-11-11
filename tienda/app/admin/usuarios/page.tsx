// app/admin/usuarios/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersTable } from '@/components/UsersTable';
import { UserForm } from '@/components/UserForm';
import { fetchUsers } from '@/lib/api/users';
import { Loader2, Plus, Users } from 'lucide-react';

export default function UsuariosPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">Administra cuentas de dueños y administradores</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Ocultar' : 'Crear Usuario'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Crear Nuevo Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm onSuccess={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <UsersTable users={users || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}