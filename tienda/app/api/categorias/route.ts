// app/api/categorias/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tiendaId = searchParams.get('tiendaId');

  if (tiendaId && isNaN(Number(tiendaId))) {
    return NextResponse.json(
      { error: 'tiendaId debe ser un número' },
      { status: 400 }
    );
  }

  const where = tiendaId ? { tienda_id: Number(tiendaId) } : {};

  try {
    const categorias = await prisma.categoria.findMany({
      where,
      include: {
        Producto: true, // relación definida como Producto[]
      },
    });

    return NextResponse.json(categorias);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}