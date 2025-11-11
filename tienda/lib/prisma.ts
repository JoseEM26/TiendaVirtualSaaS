// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Evita múltiples instancias en desarrollo (Hot Reload)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Crea una sola instancia global
const prismaClient = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

// Exporta como `prisma`
export { prismaClient as prisma };