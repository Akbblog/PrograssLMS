const express = require("express");
const usersRouter = express.Router();
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const { getPrisma } = require("../../../lib/prismaClient");

// Get all users for communication (no admin permissions required)
// Now uses Prisma (MySQL) instead of Mongoose (MongoDB)
usersRouter.get('/', isLoggedIn, async (req, res) => {
  try {
    const schoolId = req.userAuth?.schoolId;

    if (!schoolId) {
      return res.status(400).json({
        status: "fail",
        message: "School ID not found in request"
      });
    }

    // Get Prisma client
    const prisma = getPrisma();
    if (!prisma) {
      return res.status(503).json({
        status: "fail",
        message: "Database connection not available",
        error: "Prisma client not initialized. Check DATABASE_URL environment variable."
      });
    }

    // Verify the school exists
    const school = await prisma.school.findFirst({
      where: {
        id: schoolId
      },
      select: { id: true }
    });

    if (!school) {
      return res.status(404).json({
        status: "fail",
        message: "School not found"
      });
    }

    const schoolIdToQuery = school.id;

    // Fetch all users in parallel using Prisma
    const [admins, teachers, students] = await Promise.all([
      // Admins for this school
      prisma.admin.findMany({
        where: { schoolId: schoolIdToQuery },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true
        }
      }),
      // Teachers for this school
      prisma.teacher.findMany({
        where: { schoolId: schoolIdToQuery },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true
        }
      }),
      // Students for this school
      prisma.student.findMany({
        where: { schoolId: schoolIdToQuery },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true
        }
      })
    ]);

    // Normalize the data format (Prisma uses 'id', frontend expects '_id')
    const allUsers = [
      ...admins.map(u => ({ _id: u.id, name: u.name, email: u.email, avatar: u.avatar, role: u.role || 'admin' })),
      ...teachers.map(u => ({ _id: u.id, name: u.name, email: u.email, avatar: u.avatar, role: u.role || 'teacher' })),
      ...students.map(u => ({ _id: u.id, name: u.name, email: u.email, avatar: u.avatar, role: u.role || 'student' }))
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
      error: error && error.message ? error.message : String(error)
    });
  }
});

module.exports = usersRouter;