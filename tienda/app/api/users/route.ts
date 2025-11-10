// app/api/users/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { userSchema } from '@/lib/validation';
import { handleError } from '@/lib/errorHandler';
import bcrypt from 'bcrypt';

// GET: List all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true, 
        email: true,
        role: true,
        created_at: true,
        Tienda: {
          select: {
            id: true,
            nombre: true,
            slug: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    return handleError(error);
  }
}



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2)); // Improved logging
    const { name, email, password, role } = userSchema.parse(body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER',
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/users:', error); // Log errors
    return handleError(error);
  }
}