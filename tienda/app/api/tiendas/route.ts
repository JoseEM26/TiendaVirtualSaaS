// app/api/tiendas/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { tiendaSchema } from '@/lib/validation';
import { handleError } from '@/lib/errorHandler';

export async function GET() {
  try {
    const tiendas = await prisma.tienda.findMany({
      include: {
        User: true,
        Categoria: true,
        Producto: true,
      },
    });
    return NextResponse.json(tiendas);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = tiendaSchema.parse(body);

    const tienda = await prisma.tienda.create({
      data,
      include: { User: true },
    });

    return NextResponse.json(tienda, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    if (!id) throw new Error('ID requerido');

    const parsed = tiendaSchema.parse(data);

    const tienda = await prisma.tienda.update({
      where: { id: Number(id) },
      data: parsed,
      include: { User: true },
    });

    return NextResponse.json(tienda);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || isNaN(Number(id))) throw new Error('ID inválido');

    await prisma.tienda.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Tienda eliminada' });
  } catch (error) {
    return handleError(error);
  }
}