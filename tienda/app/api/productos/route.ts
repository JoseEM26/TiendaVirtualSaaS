// app/api/productos/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { productoSchema } from '@/lib/validation';
import { handleError } from '@/lib/errorHandler';

const buildWhere = (tiendaId?: string, categoriaId?: string) => {
  const where: any = { activo: true };
  if (tiendaId) where.tienda_id = Number(tiendaId);
  if (categoriaId) where.categoria_id = Number(categoriaId);
  return where;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tiendaId = searchParams.get('tiendaId');
  const categoriaId = searchParams.get('categoriaId');

  try {
    const productos = await prisma.producto.findMany({
      where: buildWhere(tiendaId, categoriaId),
      include: {
        Categoria: true,
        Tienda: { include: { User: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(productos);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = productoSchema.parse(body);

    const producto = await prisma.producto.create({
      data,
      include: { Categoria: true, Tienda: true },
    });

    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...rest } = await request.json();
    if (!id) throw new Error('ID requerido');

    const data = productoSchema.parse(rest);

    const producto = await prisma.producto.update({
      where: { id: Number(id) },
      data,
      include: { Categoria: true, Tienda: true },
    });

    return NextResponse.json(producto);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || isNaN(Number(id))) throw new Error('ID inválido');

    await prisma.producto.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Producto eliminado' });
  } catch (error) {
    return handleError(error);
  }
}