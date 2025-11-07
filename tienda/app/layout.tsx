import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProviders from "./theme-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinanStore Dashboard",
  description: "Panel administrativo de productos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100`}
      >
        <ThemeProviders>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-center">🛍️ FinanStore</h2>
                <nav className="space-y-3">
                  <a href="#" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    🏠 Dashboard
                  </a>
                  <a href="#" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    📦 Productos
                  </a>
                  <a href="#" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    💰 Ventas
                  </a>
                  <a href="#" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    ⚙️ Configuración
                  </a>
                </nav>
              </div>
              <p className="text-xs text-center text-zinc-500 mt-4">© 2025 FinanStore</p>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </ThemeProviders>
      </body>
    </html>
  );
}
