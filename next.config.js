/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return process.env.NODE_ENV === "production"
      ? [] // disable proxy for production
      : [
          // dev proxy config
        ];
  },
};

module.exports = nextConfig
