// app/api/auth/[...nextauth]/route.ts
import { handlers, auth } from '@/lib/auth';
import { logAction } from '@/lib/logger';
import { NextRequest } from 'next/server';

const { GET, POST } = handlers;

// Interceptar POST (login)
async function POST_WITH_LOG(req: NextRequest) {
  let email = '';
  let userId: number | null = null;

  try {
    const body = await req.json();
    email = body.email || 'unknown';

    // Intentar login
    const res = await POST(req);

    // === LOGIN FALLIDO ===
    if (res.status === 401 || res.status === 400) {
      await logAction({
        accion: 'LOGIN_FALLIDO',
        entidad: 'User',
        detalles: `Email: ${email} | IP: ${req.headers.get('x-forwarded-for') || req.ip}`,
        req,
      });
      return res;
    }

    // === LOGIN EXITOSO ===
    if (res.status === 200) {
      const session = await auth();
      if (session?.user?.id) {
        userId = parseInt(session.user.id);
        await logAction({
          accion: 'LOGIN_EXITOSO',
          entidad: 'User',
          entidadId: userId,
          detalles: `Email: ${session.user.email} | Rol: ${session.user.role} | Tienda: ${session.user.tiendaId || 'N/A'}`,
          req,
          userId,
        });
      }
    }

    return res;
  } catch (error: any) {
    // Error inesperado (JSON malformado, etc.)
    await logAction({
      accion: 'LOGIN_ERROR',
      entidad: 'User',
      detalles: `Email: ${email} | Error: ${error.message}`,
      req,
    });
    return new Response(JSON.stringify({ error: 'Error interno' }), { status: 500 });
  }
}

export { handlers as GET, POST_WITH_LOG as POST };