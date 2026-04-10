// next.config.js

module.exports = {
  output: 'standalone',
  allowedDevOrigins: ['192.168.1.100'],
   async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ]
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
      {
        protocol: "http",
        hostname: "192.168.1.100",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
