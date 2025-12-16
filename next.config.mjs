/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [], // Vuoto
  },
  // ✅ FORZA CSR per /quiz
  output: 'standalone', 
};

module.exports = nextConfig;