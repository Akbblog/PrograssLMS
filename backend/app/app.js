const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const routeSync = require("../handlers/routeSync.handler");
const cors = require('cors');
const limiter = require("../middlewares/rateLimiter");

// Initialize the Express application
const app = express();

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(compression()); // Compress all responses

// Middleware
app.use(express.json({ limit: '10mb' })); // Increase limit for potentially large payloads
app.use(morgan("dev")); // Log requests to the console

// Initialize cors 
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

// Rate Limiting
app.use(limiter);

try {
  // Initialize super admin route
  const superAdminRouter = require("../routes/v1/superadmin/school.router");
  app.use("/api/v1/superadmin", superAdminRouter);

  // Initialize contact route
  const contactRouter = require("../routes/v1/contact.router");
  app.use("/api/v1/contact", contactRouter);

  // Initialize staff route
  routeSync(app, "staff");
  // initialize academic route
  routeSync(app, "academic");
  // initialize student route
  routeSync(app, "students");
  // initialize finance route
  routeSync(app, "finance");
  // initialize communication route
  routeSync(app, "communication");
} catch (err) {
  console.error("Error during route initialization:", err.message);
  console.error(err.stack);
  process.exit(1);
}

// Define a default route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Handle invalid routes
app.all("*", (req, res) => {
  res.send("Invalid Route");
});

module.exports = app;
