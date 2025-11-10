// components/UserForm.tsx
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userSchema } from '@/lib/validation';
import { createUser, updateUser } from '@/lib/api/users';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { User } from '@prisma/client';
import { useEffect } from 'react';

// Define types for create and edit modes
type CreateUserFormData = z.infer<typeof userSchema>;
type EditUserFormData = z.infer<ReturnType<typeof userSchema.omit>>;
type UserFormData = CreateUserFormData | EditUserFormData;

interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!user;

  // Choose schema based on mode
  const schema = isEditing ? userSchema.omit(['password']) : userSchema;

  const form = useForm<UserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: isEditing ? undefined : '',
      role: user?.role || 'USER',
    },
    mode: 'onChange', // Validate on change for immediate feedback
  });

  const { formState: { errors, isValid, isDirty }, trigger } = form;

  const mutation = useMutation({
    mutationFn: isEditing ? (data: EditUserFormData) => updateUser(user!.id, data) : createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (onSuccess) onSuccess();
      form.reset();
    },
    onError: (error: any) => {
      form.setError('root', { message: error.message || 'Error al guardar usuario' });
    },
  });

  const onSubmit = form.handleSubmit((data: UserFormData) => {
    console.log('Form data submitted:', data);
    console.log('Form errors:', errors);
    console.log('Is form valid?', isValid);
    console.log('Is form dirty?', isDirty);
    mutation.mutate(data as any); // Cast to handle union type (safe due to schema validation)
  });

  // Trigger validation on mount to catch initial errors
  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={cn('space-y-4')}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Juan Pérez" required autoComplete="off" />
              </FormControl>
              <FormMessage>{errors.name?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="juan@example.com" required autoComplete="off" />
              </FormControl>
              <FormMessage>{errors.email?.message}</FormMessage>
            </FormItem>
          )}
        />
      {!isEditing && (
  <FormField
    control={form.control}
    name="password"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Contraseña</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="password"
            placeholder="********"
            required
            autoComplete="new-password"
          />
        </FormControl>
        <FormMessage>{errors.password?.message}</FormMessage>
      </FormItem>
    )}
  />
)}

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USER">Cliente</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="OWNER">Dueño</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage>{errors.role?.message}</FormMessage>
            </FormItem>
          )}
        />
        {errors.root && (
          <p className="text-red-500">{errors.root.message}</p>
        )}
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={mutation.isPending || !isValid || !isDirty}>
            {mutation.isPending ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Form>
  );
}