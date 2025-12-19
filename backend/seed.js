/**
 * Seed Script for MongoDB
 * Populates test data for all roles: Admin, Teacher, Student, SuperAdmin
 * Run with: node seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

// Connect to MongoDB
const DB = process.env.DB || "mongodb://localhost:27017/school-management";

mongoose
  .connect(DB)
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  });

// Import Models
const Admin = require("./models/Staff/admin.model");
const Teacher = require("./models/Staff/teachers.model");
const Student = require("./models/Students/students.model");
const School = require("./models/School.model");
const AcademicYear = require("./models/Academic/academicYear.model");
const AcademicTerm = require("./models/Academic/academicTerm.model");
const ClassLevel = require("./models/Academic/class.model");
const Subject = require("./models/Academic/subject.model");
const Enrollment = require("./models/Academic/Enrollment.model");
const Grade = require("./models/Academic/Grade.model");

// Hash password utility
const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...\n");

    // 1. Create a School
    console.log("📍 Creating test school...");

    // Calculate trial end date (14 days from now)
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    const schoolData = {
      name: "Spring Hill Academy",
      email: "school@springhill.com",
      phone: "+1-555-0123",
      address: {
        street: "123 Education Way",
        city: "New York",
        state: "NY",
        country: "USA",
        zipCode: "10001",
      },
      logo: "",
      primaryColor: "#FF4B00",
      secondaryColor: "#10B981",
      subscription: {
        plan: "standard",
        status: "active",
        startDate: new Date(),
        endDate: trialEnd,
        limits: {
          maxStudents: 500,
          maxTeachers: 50,
          maxClasses: 100,
        },
      },
    };

    let school = await School.findOne({ email: schoolData.email });
    if (!school) {
      school = await School.create(schoolData);
      console.log("✅ School created:", school.name);
    } else {
      console.log("⚠️  School already exists");
    }

    // 2. Create Admin
    console.log("\n👨‍💼 Creating admin user...");
    const adminData = {
      name: "Admin User",
      email: "admin@school.com",
      password: await hashPassword("admin123"),
      role: "admin",
      schoolId: school._id,
    };

    let admin = await Admin.findOne({ email: adminData.email });
    if (!admin) {
      adminData.permissions = {
        manageStudents: true,
        manageTeachers: true,
        manageUsers: true,
        manageFees: true,
        viewReports: true,
      };
      admin = await Admin.create(adminData);
      console.log("✅ Admin created - Email: admin@school.com, Password: admin123");
    } else {
      console.log("⚠️  Admin already exists");
    }

    // 3. Create Super Admin
    console.log("\n🦸 Creating super admin user...");
    const superAdminData = {
      name: "Super Admin",
      email: "superadmin@school.com",
      password: await hashPassword("superadmin123"),
      role: "super_admin",
      // Super admin doesn't necessarily need a schoolId, but model might require it based on validation
      // Checking model: schoolId required if role !== 'super_admin'. So we can skip it or set null.
    };

    let superAdmin = await Admin.findOne({ email: superAdminData.email });
    if (!superAdmin) {
      superAdmin = await Admin.create(superAdminData);
      console.log("✅ Super Admin created - Email: superadmin@school.com, Password: superadmin123");
    } else {
      console.log("⚠️  Super Admin already exists");
    }

    // 4. Create Academic Year
    console.log("\n📅 Creating academic year...");
    const academicYearData = {
      name: "2025-2026",
      fromYear: new Date("2025-01-01"),
      toYear: new Date("2025-12-31"),
      isCurrent: true,
      schoolId: school._id,
      createdBy: admin._id,
    };

    let academicYear = await AcademicYear.findOne({ name: academicYearData.name, schoolId: school._id });
    if (!academicYear) {
      academicYear = await AcademicYear.create(academicYearData);
      console.log("✅ Academic Year created:", academicYear.name);
    } else {
      console.log("⚠️  Academic Year already exists");
    }

    // 5. Create Academic Term
    console.log("\n⏳ Creating academic term...");
    const academicTermData = {
      name: "Term 1",
      description: "First Term",
      duration: "3 months",
      academicYear: academicYear._id,
      schoolId: school._id,
      createdBy: admin._id,
    };

    let academicTerm = await AcademicTerm.findOne({ name: academicTermData.name, schoolId: school._id });
    if (!academicTerm) {
      academicTerm = await AcademicTerm.create(academicTermData);
      console.log("✅ Academic Term created:", academicTerm.name);
    } else {
      console.log("⚠️  Academic Term already exists");
    }

    // 6. Create Class Level
    console.log("\n🏫 Creating class level...");
    const classLevelData = {
      name: "Grade 1",
      description: "First Grade",
      schoolId: school._id,
      createdBy: admin._id,
    };

    let classLevel = await ClassLevel.findOne({ name: classLevelData.name, schoolId: school._id });
    if (!classLevel) {
      classLevel = await ClassLevel.create(classLevelData);
      console.log("✅ Class Level created:", classLevel.name);
    } else {
      console.log("⚠️  Class Level already exists");
    }

    // 7. Create Teacher
    console.log("\n👨‍🏫 Creating teacher user...");
    const teacherData = {
      name: "John Teacher",
      email: "teacher@school.com",
      password: await hashPassword("teacher123"),
      role: "teacher",
      schoolId: school._id,
      createdBy: admin._id,
      academicYear: academicYear.name,
      academicTerm: academicTerm.name,
      classLevel: classLevel.name,
    };

    let teacher = await Teacher.findOne({ email: teacherData.email });
    if (!teacher) {
      teacher = await Teacher.create(teacherData);
      console.log("✅ Teacher created - Email: teacher@school.com, Password: teacher123");
    } else {
      console.log("⚠️  Teacher already exists");
    }

    // 8. Create Subject
    console.log("\n📚 Creating subject...");
    const subjectData = {
      name: "Mathematics",
      description: "Basic Math",
      academicTerm: academicTerm._id,
      schoolId: school._id,
      createdBy: admin._id,
      teacher: teacher._id,
    };

    let subject = await Subject.findOne({ name: subjectData.name, schoolId: school._id });
    if (!subject) {
      subject = await Subject.create(subjectData);
      console.log("✅ Subject created:", subject.name);
    } else {
      console.log("⚠️  Subject already exists");
    }

    // 9. Create Student
    console.log("\n🎓 Creating student user...");
    const studentData = {
      name: "Jane Student",
      email: "student@school.com",
      password: await hashPassword("student123"),
      role: "student",
      schoolId: school._id,
      academicYear: academicYear._id,
      currentClassLevels: [classLevel._id],
    };

    let student = await Student.findOne({ email: studentData.email });
    if (!student) {
      student = await Student.create(studentData);
      console.log("✅ Student created - Email: student@school.com, Password: student123");
    } else {
      console.log("⚠️  Student already exists");
    }

    // 10. Create Enrollment
    console.log("\n📝 Creating student enrollment...");
    const enrollmentData = {
      student: student._id,
      subject: subject._id,
      classLevel: classLevel._id,
      academicYear: academicYear._id,
      academicTerm: academicTerm._id,
      schoolId: school._id,
      status: "active",
      progress: 35,
    };

    let enrollment = await Enrollment.findOne({
      student: student._id,
      subject: subject._id,
      academicYear: academicYear._id,
      academicTerm: academicTerm._id,
    });
    if (!enrollment) {
      enrollment = await Enrollment.create(enrollmentData);
      console.log("✅ Enrollment created for Mathematics");
    } else {
      console.log("⚠️  Enrollment already exists");
    }

    // 11. Create a few Grades
    console.log("\n📊 Creating grade records...");
    const gradeData = [
      {
        student: student._id,
        subject: subject._id,
        classLevel: classLevel._id,
        academicYear: academicYear._id,
        academicTerm: academicTerm._id,
        schoolId: school._id,
        examType: "quiz",
        examName: "Quiz 1 - Basic Arithmetic",
        score: 85,
        maxScore: 100,
        teacher: teacher._id,
        remarks: "Good work!",
      },
      {
        student: student._id,
        subject: subject._id,
        classLevel: classLevel._id,
        academicYear: academicYear._id,
        academicTerm: academicTerm._id,
        schoolId: school._id,
        examType: "midterm",
        examName: "Midterm Exam",
        score: 78,
        maxScore: 100,
        teacher: teacher._id,
        remarks: "Needs improvement in geometry",
      },
      {
        student: student._id,
        subject: subject._id,
        classLevel: classLevel._id,
        academicYear: academicYear._id,
        academicTerm: academicTerm._id,
        schoolId: school._id,
        examType: "assignment",
        examName: "Homework Assignment 1",
        score: 92,
        maxScore: 100,
        teacher: teacher._id,
        remarks: "Excellent work on fractions!",
      },
    ];

    for (const grade of gradeData) {
      const existingGrade = await Grade.findOne({
        student: grade.student,
        subject: grade.subject,
        examName: grade.examName,
      });
      if (!existingGrade) {
        await Grade.create(grade);
        console.log(`✅ Grade created: ${grade.examName}`);
      } else {
        console.log(`⚠️  Grade already exists: ${grade.examName}`);
      }
    }


    console.log("\n" + "=".repeat(50));
    console.log("✨ Database seeding completed successfully!\n");
    console.log("Test Credentials:");
    console.log("─".repeat(50));
    console.log("ADMIN:");
    console.log("  Email: admin@school.com");
    console.log("  Password: admin123");
    console.log("  Login: http://localhost:3000/login (role: admin)");
    console.log("\nTEACHER:");
    console.log("  Email: teacher@school.com");
    console.log("  Password: teacher123");
    console.log("  Login: http://localhost:3000/login (role: teacher)");
    console.log("\nSTUDENT:");
    console.log("  Email: student@school.com");
    console.log("  Password: student123");
    console.log("  Login: http://localhost:3000/login (role: student)");
    console.log("─".repeat(50));
    console.log("SUPERADMIN:");
    console.log("  Email: superadmin@school.com");
    console.log("  Password: superadmin123");
    console.log("  Login: http://localhost:3000/login (role: super_admin)");
    console.log("=".repeat(50) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
