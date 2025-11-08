import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tiendaId = searchParams.get('tiendaId')

  const where = tiendaId ? { tiendaId: Number(tiendaId) } : {}
  
  const categorias = await prisma.categoria.findMany({
    where,
    include: { productos: true }
  })
  return NextResponse.json(categorias)
}