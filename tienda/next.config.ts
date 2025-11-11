// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ELIMINA `domains` → obsoleto
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'logo.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      // Agrega más dominios aquí si necesitas
    ],
  },
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  turbopack: {
    root: '.', // Silencia el warning de lockfiles
  },
};

export default nextConfig;