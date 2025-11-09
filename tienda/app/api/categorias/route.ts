// app/api/categorias/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { categoriaSchema } from '@/lib/validation';
import { handleError } from '@/lib/errorHandler';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tiendaId = searchParams.get('tiendaId');

  try {
    const where = tiendaId ? { tienda_id: Number(tiendaId) } : {};
    const categorias = await prisma.categoria.findMany({
      where,
      include: { Producto: true },
      orderBy: { nombre: 'asc' },
    });
    return NextResponse.json(categorias);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = categoriaSchema.parse(body);

    const categoria = await prisma.categoria.create({
      data,
      include: { Producto: true },
    });

    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}