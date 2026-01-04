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

// Security Middleware
app.use(helmet());
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

// Initialize cors 
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "https://progresslms.netlify.app",
  "https://progresslms-frontend.vercel.app",
  "https://progresslms-frontend-alis-projects-ae84a621.vercel.app",
  "https://progresslms-frontend-akbmaksa-3745-alis-projects-ae84a621.vercel.app"
  ,"https://progresslms-frontend-git-main-alis-projects-ae84a621.vercel.app"
  ,"https://progresslms.io"
  ,"https://www.progresslms.io"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow any deployment under vercel.app for this project
    if (origin.endsWith("vercel.app")) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate Limiting
app.use(limiter);

// Serve uploaded files (attachments) - local development fallback
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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
