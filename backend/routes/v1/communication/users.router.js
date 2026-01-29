const express = require("express");
const usersRouter = express.Router();
const isLoggedIn = require("../../../middlewares/isLoggedIn");

// Import individual models
const Admin = require("../../../models/Staff/admin.model");
const Teacher = require("../../../models/Staff/teachers.model");
const Student = require("../../../models/Students/students.model");

// Get all users for communication (no admin permissions required)
usersRouter.get('/', isLoggedIn, async (req, res) => {
  try {
    const schoolId = req.userAuth?.schoolId;
    
    if (!schoolId) {
      return res.status(400).json({
        status: "fail",
        message: "School ID not found in request"
      });
    }
    
    // Get all active users for communication
    // Note: Each model has different status fields
    const [admins, teachers, students] = await Promise.all([
      // Admins: Get all verified admins for this school
      Admin.find({ schoolId })
        .select('_id name email avatar role')
        .lean(),
      // Teachers: Get all active teachers (not withdrawn/suspended)
      // Use $or to support both the new `status` enum and legacy `isActive` flag
      Teacher.find({ 
        schoolId, 
        $or: [
          { status: { $in: ['active', 'inactive'] } },
          { isActive: true }
        ]
      })
        .select('_id name email avatar role')
        .lean(),
      // Students: Get all active students (not withdrawn/suspended)
      // Use $or to support both the new boolean flags and legacy `isActive`
      Student.find({ 
        schoolId,
        $or: [
          { isWithdrawn: false, isSuspended: false },
          { isActive: true }
        ]
      })
        .select('_id name email avatar role')
        .lean()
    ]);

    const allUsers = [
      ...admins.map(u => ({ ...u, role: 'admin' })),
      ...teachers.map(u => ({ ...u, role: 'teacher' })),
      ...students.map(u => ({ ...u, role: 'student' }))
    ];

    res.status(200).json({
      status: "success",
      data: allUsers
    });
  } catch (error) {
    // Log the full error object for better debugging on Vercel
    console.error("Error fetching users for communication:", error);
    res.status(500).json({
      status: "fail",
      message: "Failed to fetch users",
      // Include error details in response for debugging (remove in prod if needed)
      error: error && error.message ? error.message : String(error)
    });
  }
});

module.exports = usersRouter;