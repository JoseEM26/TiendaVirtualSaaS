// lib/types.ts
import { Prisma } from '@prisma/client';

export type CategoriaWithRelations = Prisma.CategoriaGetPayload<{
  include: { Producto: true; Tienda: true };
}>;

export type ProductoWithRelations = Prisma.ProductoGetPayload<{
  include: { Categoria: true; Tienda: { include: { User: true } } };
}>;

export type TiendaWithRelations = Prisma.TiendaGetPayload<{
  include: { User: true; Categoria: true; Producto: true };
}>;

export type UserWithRelations = Prisma.UserGetPayload<{
  include: { Tienda: true };
}>;