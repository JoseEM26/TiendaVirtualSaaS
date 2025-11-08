// app/layout.tsx
import "./globals.css"; // ← ESTA LÍNEA ES CRÍTICA

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black">
        <div className="flex flex-col min-h-screen">
          <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MiApp
              </h1>
            </div>
          </header>
          <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
            {children}
          </main>
          <footer className="bg-white dark:bg-gray-800 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} MiApp
          </footer>
        </div>
      </body>
    </html>
  );
}