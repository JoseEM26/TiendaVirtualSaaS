// app/api/users/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { userSchema } from '@/lib/validation';
import { handleError } from '@/lib/errorHandler';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { Tienda: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = userSchema.parse(body);

    const user = await prisma.user.create({
      data,
      include: { Tienda: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}