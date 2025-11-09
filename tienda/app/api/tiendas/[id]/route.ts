// app/api/tiendas/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { tiendaSchema } from '@/lib/validation';
import { handleError } from '@/lib/errorHandler';
import { slugify } from '@/lib/slugify';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

  try {
    const tienda = await prisma.tienda.findUnique({
      where: { id },
      include: {
        User: true,
        Categoria: { include: { Producto: true } },
        Producto: true,
      },
    });

    if (!tienda) return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 });
    return NextResponse.json(tienda);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

  try {
    const body = await request.json();
    const data = tiendaSchema.partial().parse(body);
    const slug = data.nombre ? slugify(data.nombre) : undefined;

    const tienda = await prisma.tienda.update({
      where: { id },
      data: { ...data, slug },
      include: { User: true },
    });

    return NextResponse.json(tienda);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

  try {
    await prisma.tienda.delete({ where: { id } });
    return NextResponse.json({ message: 'Tienda eliminada' });
  } catch (error) {
    return handleError(error);
  }
}