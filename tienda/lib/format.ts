// lib/format.ts
export const format = {
  currency: (value: number) =>
    new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value),

  date: (date: Date | string) =>
    new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date)),
};