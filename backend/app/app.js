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

try {
  // --- Static Route Imports for Serverless Compatibility ---

  // Superadmin
  app.use("/api/v1/superadmin", require("../routes/v1/superadmin/school.router"));

  // Contact
  app.use("/api/v1/contact", require("../routes/v1/contact.router"));

  // Staff
  app.use("/api/v1", require("../routes/v1/staff/admin.router"));
  app.use("/api/v1", require("../routes/v1/staff/role.router"));
  app.use("/api/v1", require("../routes/v1/staff/teachers.router"));

  // Students (moved earlier to ensure public login routes are handled before routers using router.use(isLoggedIn))
  app.use("/api/v1", require("../routes/v1/students/students.router"));

  // Academic
  app.use("/api/v1", require("../routes/v1/academic/academicTerm.router"));
  app.use("/api/v1", require("../routes/v1/academic/academicYear.router"));
  app.use("/api/v1", require("../routes/v1/academic/assessmentType.router"));
  app.use("/api/v1", require("../routes/v1/academic/assignment.router"));
  app.use("/api/v1", require("../routes/v1/academic/attendance.router"));
  app.use("/api/v1/academic/behavior", require("../routes/v1/academic/attendanceBehavior.router"));
  app.use("/api/v1", require("../routes/v1/academic/class.router"));
  app.use("/api/v1", require("../routes/v1/academic/course.router"));
  app.use("/api/v1", require("../routes/v1/academic/enrollment.router"));
  app.use("/api/v1", require("../routes/v1/academic/exams.router"));
  app.use("/api/v1", require("../routes/v1/academic/grade.router"));
  app.use("/api/v1", require("../routes/v1/academic/gradingPolicy.router"));
  app.use("/api/v1", require("../routes/v1/academic/performance.router"));
  app.use("/api/v1", require("../routes/v1/academic/program.router"));
  app.use("/api/v1", require("../routes/v1/academic/question.router"));
  app.use("/api/v1", require("../routes/v1/academic/results.router"));
  app.use("/api/v1", require("../routes/v1/academic/subject.router"));
  app.use("/api/v1", require("../routes/v1/academic/teacherAttendance.router"));
  app.use("/api/v1", require("../routes/v1/academic/yearGroup.router"));

  // Students
  app.use("/api/v1", require("../routes/v1/students/students.router"));

  // Finance
  app.use("/api/v1", require("../routes/v1/finance/fee.router"));
  app.use("/api/v1/finance", require("../routes/v1/finance/finance.router"));

  // Communication
  app.use("/api/v1", require("../routes/v1/communication/chat.router"));

} catch (err) {
  console.error("Error during route initialization:", err.message);
  console.error(err.stack);
  // Do not exit process in lambda, just log
}

// Default route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Handle invalid routes
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

module.exports = app;
