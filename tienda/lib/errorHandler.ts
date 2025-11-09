// lib/errorHandler.ts
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validación fallida', details: error.errors },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    console.error('[API ERROR]', error.message);
    if (error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Ya existe un registro con ese valor' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Error interno del servidor' },
    { status: 500 }
  );
}