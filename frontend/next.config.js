const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@/frontend": path.resolve(__dirname, "frontend"),
      "@": path.resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;
