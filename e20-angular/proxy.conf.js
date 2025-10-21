const PROXY_CONFIG = {
  "/api": {
    target: "https://localhost:8060",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    onProxyReq: function (proxyReq, req, res) {
      console.log('[PROXY] Request:', req.method, req.url);
      console.log('[PROXY] Headers:', req.headers);
    },
    onProxyRes: function (proxyRes, req, res) {
      console.log('[PROXY] Response:', proxyRes.statusCode);
      console.log('[PROXY] Response Headers:', proxyRes.headers);
    },
    onError: function (err, req, res) {
      console.error('[PROXY ERROR]', err);
    }
  }
};

module.exports = PROXY_CONFIG;
