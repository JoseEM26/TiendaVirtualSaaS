// app/admin/page.tsx
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Users, Package, TrendingUp } from 'lucide-react';

export default async function AdminDashboard() {
  const [tiendasCount, usersCount, productosCount] = await Promise.all([
    prisma.tienda.count(),
    prisma.user.count(),
    prisma.producto.count(),
  ]);

  const stats = [
    { label: 'Tiendas', value: tiendasCount, icon: Store, color: 'text-blue-600' },
    { label: 'Usuarios', value: usersCount, icon: Users, color: 'text-green-600' },
    { label: 'Productos', value: productosCount, icon: Package, color: 'text-purple-600' },
    { label: 'Crecimiento', value: '+12%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen general del sistema</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.label}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Aquí irán logs o eventos recientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tiendas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Gráfico de tiendas activas vs inactivas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}