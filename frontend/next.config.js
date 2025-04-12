// next.config.js
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin"); // Make sure to import the polyfill plugin

module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.ALLOWED_ORIGINS || "*",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
  webpack(config, { isServer }) {
    // Polyfill'ler yalnızca client-side için eklenir
    if (!isServer) {
      config.plugins.push(new NodePolyfillPlugin());
    }
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/*/**",
        search: "",
      },
    ],
  },
  // For Vercel deployments
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin"],
  },
};
