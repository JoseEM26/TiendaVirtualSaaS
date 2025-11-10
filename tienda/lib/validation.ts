// lib/validation.ts
import { z } from 'zod';

export const tiendaSchema = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().nullable().optional(),
  logo_url: z.string().url().nullable().optional(),
  ubicacion: z.string().nullable().optional(),
  whatsapp: z.string().max(20).nullable().optional(),
  email_contacto: z.string().email().max(100).nullable().optional(),
  estado: z.boolean().default(true),
  owner_id: z.number().int().positive(),
});

export const categoriaSchema = z.object({
  nombre: z.string().min(1).max(100),
  activa: z.boolean().default(true),
  tienda_id: z.number().int().positive(),
});

export const productoSchema = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().nullable().optional(),
  imagen_base64: z.string().nullable().optional(),
  precio: z.coerce.number().positive(),
  talla: z.string().max(20).nullable().optional(),
  tipo_genero: z.string().max(20).nullable().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  activo: z.boolean().default(true),
  categoria_id: z.number().int().positive(),
  tienda_id: z.number().int().positive(),
});

export const userSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: z.enum(['USER', 'ADMIN', 'OWNER']).optional().default('USER'),
});