// app/api/tiendas/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tiendas = await prisma.tienda.findMany();
    return NextResponse.json(tiendas);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al obtener tiendas' },
      { status: 500 }
    );
  }
}