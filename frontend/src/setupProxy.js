console.log('🔥 setupProxy.js is loaded');

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('🔥 Proxy middleware initializing');
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5190',
      changeOrigin: true,
      logLevel: 'debug',
    })
  );
};
