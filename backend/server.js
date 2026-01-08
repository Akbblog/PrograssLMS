const http = require("http");
require("colors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Auto-enable Prisma mode on Vercel if DATABASE_URL is set (MySQL)
// This ensures USE_PRISMA works even if not explicitly set in Vercel dashboard
if (process.env.VERCEL && process.env.DATABASE_URL && !process.env.USE_PRISMA) {
  process.env.USE_PRISMA = 'true';
  console.log('[Server] Auto-enabled USE_PRISMA=true for Vercel deployment');
}

// CORS headers that we'll add to ALL responses, even errors
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true'
};
let app;
let appError = null;
// Try to load the app, but catch any errors
try {
  app = require("./app/app");
} catch (err) {
  console.error("CRITICAL: Failed to load app:", err.message);
  console.error(err.stack);
  appError = err;
  
  // Create a minimal Express app that just returns errors with CORS headers
  const express = require("express");
  app = express();
  
  // Handle OPTIONS for CORS preflight
  app.options('*', (req, res) => {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.sendStatus(200);
  });
  
  // All other requests return the error
  app.use((req, res) => {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.status(500).json({
      error: 'Backend failed to initialize',
      message: appError.message,
      stack: process.env.NODE_ENV === 'development' ? appError.stack : undefined
    });
  });
}
const dbConnect = require("./config/dbConnect");
const port = process.env.PORT || 3001;
const server = http.createServer(app);
server.on('error', (err) => {
  console.error('Server error:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
(async () => {
  try {
    await dbConnect();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    // Don't exit - let the app run anyway so it can return proper errors with CORS
  }
  server.listen(port, () => {
    console.log(` server is running on port : ${port} `.black.bgGreen.bold);
    if (appError) {
      console.error('WARNING: App loaded with errors. Check /api/v1/debug/errors');
    }
  });
})().catch((err) => {
  console.error('Failed to start server:', err);
});
