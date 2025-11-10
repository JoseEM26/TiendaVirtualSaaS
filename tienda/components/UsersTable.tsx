// components/UsersTable.tsx
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { UserForm } from './UserForm';
import { deleteUser } from '@/lib/api/users';
import { cn } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';
import { User } from '@prisma/client';

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Tiendas</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                variant={user.role === 'ADMIN' ? 'default' : user.role === 'OWNER' ? 'secondary' : 'outline'}
                className={cn({
                  'bg-blue-500': user.role === 'ADMIN',
                  'bg-green-500': user.role === 'OWNER',
                  'border-gray-300': user.role === 'USER',
                })}
              >
                {user.role === 'USER' ? 'Cliente' : user.role === 'ADMIN' ? 'Administrador' : 'Dueño'}
              </Badge>
            </TableCell>
            <TableCell>
              {user.Tienda?.length ? user.Tienda.map((t) => t.nombre).join(', ') : 'Ninguna'}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogDescription>Edita los detalles del usuario existente.</DialogDescription>
                    <UserForm user={user} onSuccess={() => queryClient.invalidateQueries(['users'])} />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}