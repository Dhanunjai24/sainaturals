const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const { initDb } = require('./db');
const apiRoutes = require('./routes/api');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve store product images
app.use('/images', express.static(path.join(__dirname, '../../frontend/images')));
app.use('/images', express.static(path.join(__dirname, '../../frontend/public/images')));

// Serve Client Pitch Deck
app.get(['/deck', '/pitch-deck'], (req, res) => {
  res.sendFile(path.join(__dirname, '../../CLIENT_PITCH_DECK.html'));
});

// Root and API Index Handler (Friendly landing page for browser or JSON)
const handleApiWelcome = (req, res) => {
  if (req.accepts('html')) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Sri Sai Natural Foods — API Server</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0f1711; color: #f1f5f2; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: #162219; border: 1px solid #28392c; padding: 2.5rem; border-radius: 1.5rem; max-width: 520px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); text-align: center; }
          h1 { color: #4ade80; margin: 0 0 0.5rem; font-size: 1.6rem; }
          p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem; }
          .btn { display: inline-block; background: #d97706; color: white; font-weight: bold; text-decoration: none; padding: 0.85rem 1.8rem; border-radius: 9999px; transition: 0.2s; box-shadow: 0 4px 14px rgba(217,119,6,0.4); }
          .btn:hover { background: #b45309; }
          .endpoints { text-align: left; margin-top: 1.75rem; background: #0b110c; padding: 1rem 1.25rem; border-radius: 0.75rem; border: 1px solid #1f2d22; font-family: monospace; font-size: 0.85rem; color: #a7f3d0; }
          .endpoints a { color: #38bdf8; text-decoration: none; }
          .endpoints a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🌿</div>
          <h1>Sri Sai Natural Foods API</h1>
          <p>The backend REST API server is online and running on port 5000.<br>To browse the full store website, click the button below:</p>
          <a href="http://localhost:3001" class="btn">👉 Open Store Website (Port 3001)</a>
          <div class="endpoints">
            <strong>Sample API Endpoints:</strong><br>
            • <a href="/api/products">/api/products</a> (Catalog)<br>
            • <a href="/api/categories">/api/categories</a> (Aisles)<br>
            • <a href="/api/banners">/api/banners</a> (Promotions)<br>
            • <a href="/health">/health</a> (Server Status)<br>
            • <a href="/pitch-deck">/pitch-deck</a> (Client Pitch Deck)
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    res.json({
      status: 'online',
      message: 'Sri Sai Natural Foods REST API is running.',
      frontendWebsiteUrl: 'http://localhost:3001',
      sampleEndpoints: [
        '/api/products',
        '/api/categories',
        '/api/banners',
        '/api/coupons',
        '/health'
      ]
    });
  }
};

app.get('/', handleApiWelcome);
app.get('/api', handleApiWelcome);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    store: config.store.name,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `API endpoint not found: ${req.method} ${req.path}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: err.message || 'Internal server error occurred.'
  });
});

// Boot server
async function startServer() {
  try {
    await initDb();
    app.listen(config.port, () => {
      console.log(`\n🚀 Sri Sai Natural Foods Server is running on port ${config.port}`);
      console.log(`📡 Health Check: http://localhost:${config.port}/health`);
      console.log(`🛒 API Base URL: http://localhost:${config.port}/api\n`);
    });
  } catch (err) {
    console.error('Fatal Server Boot Error:', err);
    process.exit(1);
  }
}

startServer();
