/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable proper module resolution for path aliases
    esmExternals: 'loose',
  },
  webpack: (config) => {
    // Ensure proper resolution for path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname
    };
    return config;
  }
};

module.exports = nextConfig; 