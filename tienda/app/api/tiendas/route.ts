// app/api/tiendas/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { tiendaSchema } from '@/lib/validation';
import { handleError } from '@/lib/errorHandler';
import { slugify } from '@/lib/slugify';

export async function GET() {
  try {
    const tiendas = await prisma.tienda.findMany({
      where: { estado: true },
      include: {
        User: { select: { name: true, email: true } },
        _count: { select: { Producto: true, Categoria: true } },
      },
      orderBy: { created_at: 'desc' },
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
    const slug = slugify(data.nombre);

    const tienda = await prisma.tienda.create({
      data: { ...data, slug },
      include: { User: true },
    });

    return NextResponse.json(tienda, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}