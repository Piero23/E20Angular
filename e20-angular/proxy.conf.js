const PROXY_CONFIG = {
  "/api": {
    target: "https://localhost:8060",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",

    // ⭐ RIMUOVI l'header Origin nelle richieste proxate
    onProxyReq: function (proxyReq, req, res) {
      console.log('[PROXY] Request to:', req.url);
      console.log('[PROXY] Method:', req.method);

      // Rimuovi Origin header
      proxyReq.removeHeader('origin');

      // Oppure imposta Origin come il target
      proxyReq.setHeader('origin', 'https://localhost:8060');

      console.log('[PROXY] Headers sent:', JSON.stringify(proxyReq.getHeaders(), null, 2));
    },

    onProxyRes: function (proxyRes, req, res) {
      console.log('[PROXY] Response status:', proxyRes.statusCode);
    }
  }
};

module.exports = PROXY_CONFIG;
