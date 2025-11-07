"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">120</p>
          <p className="text-sm text-zinc-500">Registrados en el sistema</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ventas del día</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">S/. 2,430</p>
          <p className="text-sm text-zinc-500">Actualizado en tiempo real</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">85</p>
          <p className="text-sm text-zinc-500">Clientes recurrentes</p>
        </CardContent>
      </Card>
    </div>
  );
}
