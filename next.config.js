/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },

  modularizeImports: {
    "@mantine/core": {
      transform: "@mantine/core",
      skipDefaultConversion: true,
    },
    "@mantine/tiptap": {
      transform: "@mantine/tiptap",
      skipDefaultConversion: true,
    },
    "@tabler/icons": {
      transform: "@tabler/icons",
      skipDefaultConversion: true,
    },
  },
};

module.exports = nextConfig;
