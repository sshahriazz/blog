/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: { appDir: true },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },

  modularizeImports: {
    "@mantine/core": {
      transform: "@mantine/core",
      skipDefaultConversion: true,
    },
    "@tabler/icons": {
      transform: "@tabler/icons",
      skipDefaultConversion: true,
    },
  },
};

module.exports = nextConfig;
