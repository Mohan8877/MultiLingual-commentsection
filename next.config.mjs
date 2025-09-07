/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
   experimental: {
    allowedDevOrigins: ['http://10.159.105.41:3000'],
  },

}

export default nextConfig

