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
    if (error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Ya existe un registro con ese valor' },
        { status: 409 }
      );
    }

    console.error('[API ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Error interno' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Error desconocido' },
    { status: 500 }
  );
}