// proxy.ts (raíz del proyecto)
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const session = token ? {
    user: {
      id: token.id as string,
      email: token.email as string,
      role: token.role as string,
      tiendaId: token.tiendaId ? parseInt(token.tiendaId as string) : null,
    }
  } : null;

  const isAdminRoute = pathname.startsWith('/admin');
  const isOwnerDashboard = pathname.match(/^\/tiendas\/(\d+)\/dashboard/);

  // === LOG SIMPLE EN EDGE (NO PRISMA) ===
  const log = {
    timestamp: new Date().toISOString(),
    accion: '',
    entidad: 'Ruta',
    detalles: '',
    ip: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown',
    userId: session?.user?.id ? parseInt(session.user.id) : null,
  };

  // === ACCESO NO AUTORIZADO ===
  if ((isAdminRoute || isOwnerDashboard) && !session?.user) {
    log.accion = 'ACCESO_NO_AUTORIZADO';
    log.detalles = `Ruta: ${pathname}`;
    console.log('LOG EDGE:', log);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // === ADMIN SOLO ADMIN ===
  if (isAdminRoute && session?.user?.role !== 'ADMIN') {
    log.accion = 'ACCESO_DENEGADO';
    log.detalles = `Admin route | Rol: ${session.user.role}`;
    console.log('LOG EDGE:', log);
    return NextResponse.redirect(new URL('/', req.url));
  }

  // === OWNER SOLO SU TIENDA ===
  if (isOwnerDashboard) {
    const tiendaId = parseInt(isOwnerDashboard[1]);
    if (session?.user?.role !== 'OWNER' || session.user.tiendaId !== tiendaId) {
      log.accion = 'ACCESO_DENEGADO';
      log.entidad = 'Tienda';
      log.detalles = `User ${session.user.id} tried tienda ${tiendaId}`;
      log.userId = parseInt(session.user.id);
      console.log('LOG EDGE:', log);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/tiendas/:path*/dashboard/:path*'],
};