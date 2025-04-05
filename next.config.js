// next.config.js
module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8080',
          pathname: '/uploads/**',
        },
      ],
    },
  };
  