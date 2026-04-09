// next.config.js

module.exports = {
  output: 'standalone',
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
  allowedDevOrigins: ['192.168.1.100', '192.168.1.100:3020'],
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
