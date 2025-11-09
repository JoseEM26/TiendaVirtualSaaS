// lib/validation.ts
import { z } from 'zod';

export const categoriaSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido').max(100),
  activa: z.boolean().default(true),
  tienda_id: z.number().int().positive('Tienda inválida'),
});

export const productoSchema = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().nullable().optional(),
  imagen_base64: z.string().nullable().optional(),
  precio: z.number().positive('Precio debe ser positivo'),
  talla: z.string().max(20).nullable().optional(),
  tipo_genero: z.string().max(20).nullable().optional(),
  stock: z.number().int().min(0).default(0),
  activo: z.boolean().default(true),
  categoria_id: z.number().int().positive(),
  tienda_id: z.number().int().positive(),
});

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

export const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(100),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});