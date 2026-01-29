const express = require("express");
const usersRouter = express.Router();
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const { unwrapArray } = require("../../../handlers/responseStatus.handler");
const User = require("../../../models/Users/user.model");

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
    const [admins, teachers, students] = await Promise.all([
      User.find({ role: 'admin', schoolId, isActive: true })
        .select('_id name email avatar role')
        .lean(),
      User.find({ role: 'teacher', schoolId, isActive: true })
        .select('_id name email avatar role')
        .lean(),
      User.find({ role: 'student', schoolId, isActive: true })
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
    console.error("Error fetching users for communication:", error);
    res.status(500).json({
      status: "fail",
      message: "Failed to fetch users"
    });
  }
});

module.exports = usersRouter;