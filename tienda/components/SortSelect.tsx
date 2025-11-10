'use client';
import { ArrowUpDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SortSelectProps {
  defaultValue: string;
}

export default function SortSelect({ defaultValue }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-500" />
      <select
        className="select select-bordered select-sm w-full max-w-xs"
        defaultValue={defaultValue}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="nuevo">Más nuevos</option>
        <option value="precio-asc">Precio: bajo a alto</option>
        <option value="precio-desc">Precio: alto a bajo</option>
        <option value="stock">Más stock</option>
      </select>
    </div>
  );
}