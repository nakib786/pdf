/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@ilovepdf/ilovepdf-nodejs']
  },
  // Increase the maximum request size for file uploads
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    },
    responseLimit: false
  }
}

module.exports = nextConfig