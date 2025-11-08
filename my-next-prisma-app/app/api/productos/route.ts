import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// Tipo correcto para el where (evitamos any)
type ProductoWhereInput = {
  activo?: boolean
  tiendaId?: number
  categoriaId?: number
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tiendaId = searchParams.get('tiendaId')
  const categoriaId = searchParams.get('categoriaId')

  const where: ProductoWhereInput = { activo: true }

  if (tiendaId) where.tiendaId = Number(tiendaId)
  if (categoriaId) where.categoriaId = Number(categoriaId)

  const productos = await prisma.producto.findMany({
    where,
    include: {
      categoria: true,
      tienda: {
        include: {
          owner: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(productos)
}