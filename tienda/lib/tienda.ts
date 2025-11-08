// lib/tienda.ts
import { prisma } from "@/lib/prisma";
import type { Tienda } from "@/lib/types";

export async function getCurrentTienda(): Promise<Tienda | null> {
  // Simulación: tienda por subdomain, cookie, o user
  // Ej: const subdomain = getSubdomain();
  // return await prisma.tienda.findFirst({ where: { subdomain } });

  // POR AHORA: tienda con ID 1 (o la primera)
  return await prisma.tienda.findFirst({
    where: { id: 1 },
    select: {
      id: true,
      nombre: true,
      logo_url: true,
    },
  });
}