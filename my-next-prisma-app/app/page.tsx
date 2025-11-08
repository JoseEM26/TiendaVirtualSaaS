// app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-2xl text-center max-w-md">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
          TAILWIND FUNCIONA
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Fondo degradado + tarjeta con sombra
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
          Click me
        </button>
      </div>
    </div>
  );
}