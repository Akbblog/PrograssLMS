const express = require("express");
require("colors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
// const routeSync = require("../handlers/routeSync.handler"); // Deprecated for Netlify functions
const cors = require('cors');
const limiter = require("../middlewares/rateLimiter");

// Initialize the Express application
const app = express();

// Initialize Event-Driven Architecture
const eventBus = require("../utils/eventBus");
const listeners = require("../listeners");
eventBus.init(listeners);

// Initialize CORS (PERMISSIVE - run before other middleware)
app.use(cors({
  origin: true,  // allow all origins (or provide a list)
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With']
}));

// Handle preflight requests for ALL routes (explicit handler)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Security Middleware - helmet should allow cross-origin resources
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use(compression());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(morgan("dev"));

// Debug middleware to log incoming API requests and Authorization header
app.use((req, res, next) => {
  try {
    if (req.originalUrl && req.originalUrl.startsWith('/api/v1')) {
      console.log('[DEBUG APP] Incoming:', req.method, req.originalUrl, 'Authorization:', req.headers.authorization || req.headers.Authorization);
    }
  } catch (err) {
    console.error('[DEBUG APP] Logging error:', err.message);
  }
  next();
});

// Rate Limiting (after CORS)
app.use(limiter);

// Serve uploaded files (attachments) - local development fallback
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (fs.existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir));
} else {
  console.warn('[APP] Uploads directory not found; skipping static /uploads route');
}

try {
  // --- Route Initialization ---
  console.log('[ROUTES] Starting route initialization...');

  // Mount all v1 routes
  app.use('/api/v1', require('../routes/v1'));

  console.log('[ROUTES] All routes initialized successfully!');

} catch (err) {
  console.error("Error during route initialization:", err.message);
  console.error(err.stack);
  // Do not exit process in lambda, just log
}

// Default route
app.get("/", (req, res) => {
  res.json({ message: "ProgressLMS Backend API is running!", status: "ok" });
});

// Handle invalid routes
app.all("*", (req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route Not Found", path: req.originalUrl });
});

module.exports = app;
