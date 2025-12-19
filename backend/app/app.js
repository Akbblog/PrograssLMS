const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
// const routeSync = require("../handlers/routeSync.handler"); // Deprecated for Netlify functions
const cors = require('cors');
const limiter = require("../middlewares/rateLimiter");

// Initialize the Express application
const app = express();

// Security Middleware
app.use(helmet());
app.use(compression());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(morgan("dev"));

// Initialize cors 
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
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

  // Academic
  app.use("/api/v1", require("../routes/v1/academic/academicTerm.router"));
  app.use("/api/v1", require("../routes/v1/academic/academicYear.router"));
  app.use("/api/v1", require("../routes/v1/academic/assessmentType.router"));
  app.use("/api/v1", require("../routes/v1/academic/assignment.router"));
  app.use("/api/v1", require("../routes/v1/academic/attendance.router"));
  app.use("/api/v1", require("../routes/v1/academic/class.router"));
  app.use("/api/v1", require("../routes/v1/academic/course.router"));
  app.use("/api/v1", require("../routes/v1/academic/enrollment.router"));
  app.use("/api/v1", require("../routes/v1/academic/exams.router"));
  app.use("/api/v1", require("../routes/v1/academic/grade.router"));
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
