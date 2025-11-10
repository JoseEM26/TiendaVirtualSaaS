// components/ReloadButton.tsx
'use client';

export default function ReloadButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Recargar página
    </button>
  );
}