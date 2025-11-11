// lib/logger.ts
import { prisma } from '@/lib/prisma';

export async function logAction({
  accion,
  entidad,
  entidadId,
  detalles,
  req,
  tiendaId,
  userId,
}: {
  accion: string;
  entidad: string;
  entidadId?: number;
  detalles?: string;
  req?: any;
  tiendaId?: number;
  userId?: number;
}) {
  const ip = req?.headers?.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const userAgent = req?.headers?.get('user-agent') || 'unknown';

  try {
    await prisma.log.create({
      data: {
        userId: userId || null,
        tiendaId: tiendaId || null,
        accion,
        entidad,
        entidadId: entidadId || null,
        detalles: detalles || null,
        ip,
        userAgent,
      },
    });
  } catch (error: any) {
    console.error('Error en logAction:', error.message);
  }
}