import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ylsjemimfthartxiczbv.supabase.co", // solo el hostname
        port: "", // usualmente vacío
        pathname: "/storage/v1/object/public/**", // patrón para tus imágenes públicas
      },
    ],
  },
};

export default nextConfig;
