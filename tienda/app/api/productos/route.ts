// app/api/productos/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tiendaId = searchParams.get('tiendaId');
  const categoriaId = searchParams.get('categoriaId');

  const where: any = { activo: true };

  if (tiendaId) {
    const id = Number(tiendaId);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'tiendaId debe ser un número' },
        { status: 400 }
      );
    }
    where.tienda_id = id;
  }

  if (categoriaId) {
    const id = Number(categoriaId);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'categoriaId debe ser un número' },
        { status: 400 }
      );
    }
    where.categoria_id = id;
  }

  try {
    const productos = await prisma.producto.findMany({
      where,
      include: {
        Categoria: true,
        Tienda: {
          include: {
            User: true, // owner es User
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(productos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}