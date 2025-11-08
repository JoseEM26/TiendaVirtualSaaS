import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const tiendas = await prisma.tienda.findMany({
    include: {
      owner: true,
      categorias: true,
      productos: true
    }
  })
  return NextResponse.json(tiendas)
}

export async function POST(request: Request) {
  const body = await request.json()
  const tienda = await prisma.tienda.create({
    data: {
      nombre: body.nombre,
      ownerId: body.ownerId,
      descripcion: body.descripcion || null,
      logoUrl: body.logoUrl || null,
      ubicacion: body.ubicacion || null,
      whatsapp: body.whatsapp || null,
      emailContacto: body.emailContacto || null
    }
  })
  return NextResponse.json(tienda)
}