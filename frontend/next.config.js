const NodePolyfillPlugin = require("node-polyfill-webpack-plugin"); // Make sure to import the polyfill plugin

module.exports = {
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
};
