const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.TARGET || 'http://default-target-url.com';
const userServiceProxy = createProxyMiddleware({
  target,
  changeOrigin: true,
  logLevel: 'debug',
  timeout: 30000, 
  on: {
    proxyReq: (proxyReq, req, res) => {
      const origin = process.env.CURRENT;
      if (origin) {
        proxyReq.setHeader('origin', origin);
        console.log(`Origin header set to: ${origin}`);
      } else {
        console.error('Origin header is undefined');
      }
    },
    error: (err, req, res) => {
      console.error('Proxy error:', err);
      if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
        res.writeHead(504, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'The request timed out. Please try again later.' }));
      } else {
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Something went wrong. Please notify the developer.' }));
      }
    },
  },
});

module.exports = {
  userServiceProxy,
};
