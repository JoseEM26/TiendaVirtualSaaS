// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'logo.com',
      'via.placeholder.com',
      'res.cloudinary.com',
      'images.unsplash.com',
      // Agrega aquí cualquier dominio que uses para logos
    ],
    // O si usas URLs completas con subdominios, usa remotePatterns:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite TODOS los dominios (solo en desarrollo)
        port: '',
        pathname: '**',
      },
    ],
  },
  // Opcional: mejora de rendimiento
  reactStrictMode: true,
};

module.exports = nextConfig;