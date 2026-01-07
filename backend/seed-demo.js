
/**
 * DEMO Seed Script for MongoDB
 * Populates 10 Teachers and 25 Students for one School
 * Run with: node seed-demo.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
const DB = process.env.DB || "mongodb://localhost:27017/school-management";

mongoose
    .connect(DB, {
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000, // 45 seconds
    })
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
const Assignment = require("./models/Academic/Assignment.model");
const Attendance = require("./models/Academic/Attendance.model");
const FeeStructure = require("./models/Finance/FeeStructure.model");
const FeePayment = require("./models/Finance/FeePayment.model");
const QuestionBank = require("./models/Academic/Question.model");

// Utility: Hash password
const hashPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
};

// Utility: Random element from array
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Main seeding function
const seedDemo = async () => {
    try {
        console.log("🌱 Starting DEMO database seeding (10 Teachers, 25 Students)...\\n");

        // Clear existing data
        console.log("🗑️  Clearing existing data...");
        await Promise.all([
            School.deleteMany({}),
            Student.deleteMany({}),
            Teacher.deleteMany({ role: { $ne: "super_admin" } }),
            Admin.deleteMany({ role: { $ne: "super_admin" } }),
            Enrollment.deleteMany({}),
            Grade.deleteMany({}),
            Assignment.deleteMany({}),
            Attendance.deleteMany({}),
            FeePayment.deleteMany({}),
            FeeStructure.deleteMany({}),
            ClassLevel.deleteMany({}),
            Subject.deleteMany({}),
            AcademicTerm.deleteMany({}),
            AcademicYear.deleteMany({}),
            QuestionBank.deleteMany({}),
        ]);
        console.log("✅ Existing data cleared\n");

        const credentials = {
            superadmin: { email: "SA@progresslms.com", password: "Superpass" },
            admin: { email: "admin@school.com", password: "admin123" },
            teachers: [],
            students: []
        };

        // 1. Create School
        console.log("📍 Creating demo school...");
        const school = await School.create({
            name: "Progress International Academy",
            email: "contact@progress.edu",
            phone: "+1-800-PROGRESS",
            address: {
                street: "42 Innovation Blvd",
                city: "Silicon Valley",
                state: "CA",
                country: "USA",
                zipCode: "94025",
            },
            primaryColor: "#FF4B00",
            secondaryColor: "#111827",
            subscription: {
                plan: "premium",
                status: "active",
                startDate: new Date(),
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                limits: { maxStudents: 5000, maxTeachers: 500, maxClasses: 200 },
            },
            features: {
                onlineExams: true,
                attendance: true,
                analytics: true,
                whiteLabel: true,
                parentPortal: true,
                smsNotifications: true,
                canManageTeachers: true,
                canManageStudents: true,
                canManageAcademics: true,
                canManageAttendance: true,
                canManageCommunication: true,
                canManageExams: true,
                canManageFinance: true,
                canViewReports: true,
                canManageRoles: true,
            }
        });

        // 2. Create Super Admin
        console.log("🦸 Creating super admin...");
        // Ensure the specific superadmin exists/is updated
        await Admin.deleteOne({ email: "SA@progresslms.com" });
        await Admin.create({
            name: "Super Admin",
            email: "SA@progresslms.com",
            password: await hashPassword("Superpass"),
            role: "super_admin",
        });

        // 3. Create School Admin
        console.log("👨‍💼 Creating school admin...");
        const admin = await Admin.create({
            name: "Academy Director",
            email: "admin@school.com",
            password: await hashPassword("admin123"),
            role: "admin",
            schoolId: school._id,
            permissions: {
                manageStudents: true,
                manageTeachers: true,
                manageUsers: true,
                manageFees: true,
                viewReports: true,
            },
        });

        // 4. Create Academic Year & Terms
        const academicYear = await AcademicYear.create({
            name: "2025/26 Academic Year",
            fromYear: new Date("2025-01-01"),
            toYear: new Date("2025-12-31"),
            isCurrent: true,
            schoolId: school._id,
            createdBy: admin._id,
        });

        const term = await AcademicTerm.create({
            name: "Spring Semester",
            description: "First semester of 2025",
            duration: "6 months",
            academicYear: academicYear._id,
            schoolId: school._id,
            createdBy: admin._id,
        });

        // 5. Create Classes
        console.log("🏫 Creating 5 Grade levels...");
        const classes = [];
        const classNames = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"];
        for (const name of classNames) {
            const cls = await ClassLevel.create({
                name,
                description: `Standard curriculum for ${name}`,
                schoolId: school._id,
                createdBy: admin._id,
            });
            classes.push(cls);
        }

        // 6. Create 10 Teachers
        console.log("👨‍🏫 Creating 10 teachers...");
        const teacherSpecs = [
            { name: "Robert Smith", subject: "Mathematics" },
            { name: "Maria Garcia", subject: "English Literature" },
            { name: "Suresh Kumar", subject: "Physics" },
            { name: "Elena Petrova", subject: "History" },
            { name: "Aisha Diallo", subject: "Biology" },
            { name: "Kenji Tanaka", subject: "Computer Science" },
            { name: "Sophie Martin", subject: "Art & Design" },
            { name: "Thomas Muller", subject: "Physical Education" },
            { name: "Isabella Rossi", subject: "Chemistry" },
            { name: "Liam O'Connor", subject: "Music" }
        ];

        const subjects = [];
        for (let i = 0; i < teacherSpecs.length; i++) {
            const spec = teacherSpecs[i];
            const email = `teacher${i + 1}@progress.edu`;
            const password = "teacher123";
            const teacher = await Teacher.create({
                name: spec.name,
                email: email,
                password: await hashPassword(password),
                role: "teacher",
                schoolId: school._id,
                createdBy: admin._id,
                academicYear: academicYear.name,
                academicTerm: term.name,
            });

            const subject = await Subject.create({
                name: spec.subject,
                description: `Comprehensive ${spec.subject} module`,
                schoolId: school._id,
                academicTerm: term._id,
                teacher: teacher._id,
                createdBy: admin._id
            });
            subjects.push(subject);
            credentials.teachers.push({ name: spec.name, email, password, subject: spec.subject });
        }

        // 7. Create 25 Students
        console.log("🎓 Creating 25 students...");
        const firstNames = ["Liam", "Noah", "Oliver", "James", "Elijah", "William", "Henry", "Lucas", "Benjamin", "Theodore", "Emma", "Olivia", "Ava", "Sophia", "Charlotte", "Amelia", "Mia", "Harper", "Evelyn", "Abigail", "Daniel", "Matthew", "Jacob", "Michael", "Alexander"];
        const lastNames = ["Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas"];

        for (let i = 0; i < 25; i++) {
            const firstName = firstNames[i];
            const lastName = randomFrom(lastNames);
            const email = `student${i + 1}@progress.edu`;
            const password = "student123";

            const classLevel = classes[i % classes.length];

            const student = await Student.create({
                name: `${firstName} ${lastName}`,
                email: email,
                password: await hashPassword(password),
                role: "student",
                schoolId: school._id,
                academicYear: academicYear._id,
                currentClassLevels: [classLevel._id],
                dateOfBirth: new Date(2010 + (i % 5), Math.floor(Math.random() * 12), 1)
            });

            // Enroll in at least 3 subjects
            for (let j = 0; j < 3; j++) {
                const subjIndex = (i + j) % subjects.length;
                await Enrollment.create({
                    student: student._id,
                    subject: subjects[subjIndex]._id,
                    classLevel: classLevel._id,
                    academicYear: academicYear._id,
                    academicTerm: term._id,
                    schoolId: school._id,
                    status: "active",
                    progress: Math.floor(Math.random() * 50) + 10
                });
            }

            credentials.students.push({ name: student.name, email, password, class: classLevel.name });
        }

        // 8. Populate Question Bank
        console.log("📝 Populating Question Bank...");
        const demoQuestions = [
            {
                subjectName: "Mathematics",
                questions: [
                    {
                        questionText: "What is the square root of 144?",
                        questionType: "mcq",
                        options: [
                            { text: "10", isCorrect: false },
                            { text: "12", isCorrect: true },
                            { text: "14", isCorrect: false },
                            { text: "16", isCorrect: false }
                        ],
                        difficulty: "easy",
                        explanation: "12 * 12 = 144"
                    },
                    {
                        questionText: "Solve for x: 2x + 5 = 15",
                        questionType: "mcq",
                        options: [
                            { text: "x = 5", isCorrect: true },
                            { text: "x = 10", isCorrect: false },
                            { text: "x = 7", isCorrect: false },
                            { text: "x = 2", isCorrect: false }
                        ],
                        difficulty: "medium",
                        explanation: "2x = 15 - 5 => 2x = 10 => x = 5"
                    }
                ]
            },
            {
                subjectName: "Physics",
                questions: [
                    {
                        questionText: "Which of the following is the unit of Force?",
                        questionType: "mcq",
                        options: [
                            { text: "Joule", isCorrect: false },
                            { text: "Newton", isCorrect: true },
                            { text: "Watt", isCorrect: false },
                            { text: "Pascal", isCorrect: false }
                        ],
                        difficulty: "easy"
                    },
                    {
                        questionText: "The speed of light in a vacuum is approximately 300,000 km/s.",
                        questionType: "true-false",
                        correctAnswer: "true",
                        difficulty: "easy"
                    }
                ]
            },
            {
                subjectName: "English Literature",
                questions: [
                    {
                        questionText: "Who wrote 'Romeo and Juliet'?",
                        questionType: "mcq",
                        options: [
                            { text: "Charles Dickens", isCorrect: false },
                            { text: "William Shakespeare", isCorrect: true },
                            { text: "Mark Twain", isCorrect: false },
                            { text: "Jane Austen", isCorrect: false }
                        ],
                        difficulty: "easy"
                    },
                    {
                        questionText: "Describe the main theme of 'The Great Gatsby'.",
                        questionType: "short",
                        difficulty: "hard"
                    }
                ]
            }
        ];

        for (const set of demoQuestions) {
            const subject = subjects.find(s => s.name === set.subjectName);
            if (!subject) continue;

            for (const qData of set.questions) {
                await QuestionBank.create({
                    ...qData,
                    subject: subject._id,
                    schoolId: school._id,
                    createdBy: admin._id
                });
            }
        }

        // Generate Markdown Report
        let mdContent = `# 🚀 Demo Account Credentials

`;
        mdContent += `This file contains credentials for the Progress LMS Demo School populated with 10 teachers and 25 students.

`;

        mdContent += `## 🔑 Central Roles

`;
        mdContent += `| Role | Email | Password |
`;
        mdContent += `| :--- | :--- | :--- |
`;
        mdContent += `| **Super Admin** | \`${credentials.superadmin.email}\` | \`${credentials.superadmin.password}\` |
`;
        mdContent += `| **School Admin** | \`${credentials.admin.email}\` | \`${credentials.admin.password}\` |

`;

        mdContent += `## 👨‍🏫 Teachers (10 Created)

`;
        mdContent += `| Name | Email | Password | Primary Subject |
`;
        mdContent += `| :--- | :--- | :--- | :--- |
`;
        credentials.teachers.forEach(t => {
            mdContent += `| ${t.name} | \`${t.email}\` | \`${t.password}\` | ${t.subject} |
`;
        });

        mdContent += `
## 🎓 Students (25 Created)

`;
        mdContent += `| Name | Email | Password | Class |
`;
        mdContent += `| :--- | :--- | :--- | :--- |
`;
        credentials.students.forEach(s => {
            mdContent += `| ${s.name} | \`${s.email}\` | \`${s.password}\` | ${s.class} |
`;
        });

        const reportPath = path.join(__dirname, '..', 'DEMO_CREDENTIALS.md');
        fs.writeFileSync(reportPath, mdContent);
        console.log(`\n✅ Seeding complete! Credentials saved to ${reportPath}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    }
};

seedDemo();
