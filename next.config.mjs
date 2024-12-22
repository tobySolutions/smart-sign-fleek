// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      // Enable if needed
      // serverActions: true,
    },
    // Example: If you need to handle specific redirects
    async redirects() {
      return [
        {
          source: '/demo',
          destination: '/routes/demo',
          permanent: true,
        },
      ]
    }
  };
  
  export default nextConfig;