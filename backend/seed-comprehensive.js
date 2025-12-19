/**
 * COMPREHENSIVE Seed Script for MongoDB
 * Populates extensive test data for all roles: Admin, Teacher, Student, SuperAdmin
 * Run with: node seed-comprehensive.js
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
const Assignment = require("./models/Academic/Assignment.model");
const Attendance = require("./models/Academic/Attendance.model");
const FeeStructure = require("./models/Finance/FeeStructure.model");
const FeePayment = require("./models/Finance/FeePayment.model");

// Utility: Hash password
const hashPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
};

// Utility: Random date in range
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Utility: Random element from array
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Main seeding function
const seedDatabase = async () => {
    try {
        console.log("🌱 Starting COMPREHENSIVE database seeding...\\n");
        console.log("⚠️  This will clear existing data and create new test data.\\n");

        // Clear existing data
        console.log("🗑️  Clearing existing data...");
        await Promise.all([
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
        ]);
        console.log("✅ Existing data cleared\\n");

        // 1. Create School
        console.log("📍 Creating test school...");
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 365); // 1 year trial

        let school = await School.findOne({ email: "school@springhill.com" });
        if (!school) {
            school = await School.create({
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
                    plan: "premium",
                    status: "active",
                    startDate: new Date(),
                    endDate: trialEnd,
                    limits: {
                        maxStudents: 1000,
                        maxTeachers: 100,
                        maxClasses: 50,
                    },
                },
            });
            console.log("✅ School created:", school.name);
        } else {
            console.log("⚠️  School already exists");
        }

        // 2. Create Super Admin
        console.log("\\n🦸 Creating super admin...");
        let superAdmin = await Admin.findOne({ email: "superadmin@school.com" });
        if (!superAdmin) {
            superAdmin = await Admin.create({
                name: "Super Admin",
                email: "superadmin@school.com",
                password: await hashPassword("superadmin123"),
                role: "super_admin",
            });
            console.log("✅ Super Admin created");
        } else {
            console.log("⚠️  Super Admin already exists");
        }

        // 3. Create School Admin
        console.log("\\n👨‍💼 Creating school admin...");
        const admin = await Admin.create({
            name: "John Administrator",
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
        console.log("✅ Admin created - Email: admin@school.com, Password: admin123");

        // 4. Create Academic Year
        console.log("\\n📅 Creating academic year...");
        const academicYear = await AcademicYear.create({
            name: "2025-2026",
            fromYear: new Date("2025-01-01"),
            toYear: new Date("2025-12-31"),
            isCurrent: true,
            schoolId: school._id,
            createdBy: admin._id,
        });
        console.log("✅ Academic Year created:", academicYear.name);

        // 5. Create Academic Terms
        console.log("\\n⏳ Creating academic terms...");
        const terms = [];
        const termNames = [
            { name: "Term 1", desc: "September - December" },
            { name: "Term 2", desc: "January - March" },
            { name: "Term 3", desc: "April - June" },
        ];

        for (const termData of termNames) {
            const term = await AcademicTerm.create({
                name: termData.name,
                description: termData.desc,
                duration: "3 months",
                academicYear: academicYear._id,
                schoolId: school._id,
                createdBy: admin._id,
            });
            terms.push(term);
            console.log(`✅ Term created: ${term.name}`);
        }

        // 6. Create Classes
        console.log("\\n🏫 Creating classes...");
        const classes = [];
        const classNames = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"];

        for (const className of classNames) {
            const classLevel = await ClassLevel.create({
                name: className,
                description: `${className} Class`,
                schoolId: school._id,
                createdBy: admin._id,
            });
            classes.push(classLevel);
            console.log(`✅ Class created: ${classLevel.name}`);
        }

        // 7. Create Teachers
        console.log("\\n👨‍🏫 Creating teachers...");
        const teachers = [];
        const teacherData = [
            { name: "Sarah Mathematics", email: "sarah.math@school.com", subject: "Mathematics" },
            { name: "David Science", email: "david.science@school.com", subject: "Science" },
            { name: "Emily English", email: "emily.english@school.com", subject: "English" },
            { name: "Michael History", email: "michael.history@school.com", subject: "History" },
            { name: "Lisa Art", email: "lisa.art@school.com", subject: "Art" },
            { name: "Robert PE", email: "robert.pe@school.com", subject: "Physical Education" },
            { name: "Jennifer Music", email: "jennifer.music@school.com", subject: "Music" },
        ];

        for (const data of teacherData) {
            const teacher = await Teacher.create({
                name: data.name,
                email: data.email,
                password: await hashPassword("teacher123"),
                role: "teacher",
                schoolId: school._id,
                createdBy: admin._id,
                academicYear: academicYear.name,
                academicTerm: terms[0].name,
                // `classLevel` is stored as an ObjectId (ref ClassLevel)
                classLevel: classes[0]._id,
            });
            teachers.push({ ...teacher.toObject(), subjectName: data.subject });
            console.log(`✅ Teacher created: ${teacher.name} - Email: ${data.email}`);
        }

        // 8. Create Subjects
        console.log("\\n📚 Creating subjects...");
        const subjects = [];
        for (let i = 0; i < teachers.length; i++) {
            const subject = await Subject.create({
                name: teachers[i].subjectName,
                description: `${teachers[i].subjectName} curriculum`,
                academicTerm: terms[0]._id,
                schoolId: school._id,
                createdBy: admin._id,
                teacher: teachers[i]._id,
            });
            subjects.push(subject);
            console.log(`✅ Subject created: ${subject.name}`);
        }

        // 9. Create Students
        console.log("\\n🎓 Creating students...");
        const students = [];
        const firstNames = ["James", "Emma", "Oliver", "Sophia", "Liam", "Ava", "Noah", "Isabella", "William", "Mia", "Lucas", "Charlotte", "Benjamin", "Amelia", "Ethan"];
        const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Moore"];

        for (let i = 0; i < 15; i++) {
            const firstName = firstNames[i];
            const lastName = randomFrom(lastNames);
            const classIndex = Math.floor(i / 3); // 3 students per class
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@student.school.com`;

            const student = await Student.create({
                name: `${firstName} ${lastName}`,
                email: email,
                password: await hashPassword("student123"),
                role: "student",
                schoolId: school._id,
                academicYear: academicYear._id,
                currentClassLevels: [classes[classIndex]._id],
                dateOfBirth: new Date(2010 + classIndex, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
            });
            students.push({ ...student.toObject(), classIndex });
            console.log(`✅ Student created: ${student.name} (${classes[classIndex].name}) - Email: ${email}`);
        }

        // 10. Create Enrollments
        console.log("\\n📝 Creating enrollments...");
        let enrollmentCount = 0;
        for (const student of students) {
            // Enroll each student in all subjects for their class
            for (const subject of subjects) {
                const enrollment = await Enrollment.create({
                    student: student._id,
                    subject: subject._id,
                    classLevel: classes[student.classIndex]._id,
                    academicYear: academicYear._id,
                    academicTerm: terms[0]._id,
                    schoolId: school._id,
                    status: "active",
                    progress: Math.floor(Math.random() * 60) + 20, // 20-80% progress
                });
                enrollmentCount++;
            }
        }
        console.log(`✅ Created ${enrollmentCount} enrollments`);

        // 11. Create Grades
        console.log("\\n📊 Creating grades...");
        let gradeCount = 0;
        const examTypes = ["quiz", "midterm", "final", "assignment", "project"];

        for (const student of students) {
            for (const subject of subjects) {
                // Create 3-5 grades per subject per student
                const numGrades = Math.floor(Math.random() * 3) + 3;
                for (let i = 0; i < numGrades; i++) {
                    const examType = randomFrom(examTypes);
                    const score = Math.floor(Math.random() * 40) + 60; // 60-100

                    await Grade.create({
                        student: student._id,
                        subject: subject._id,
                        classLevel: classes[student.classIndex]._id,
                        academicYear: academicYear._id,
                        academicTerm: terms[0]._id,
                        schoolId: school._id,
                        examType: examType,
                        examName: `${subject.name} ${examType.charAt(0).toUpperCase() + examType.slice(1)} ${i + 1}`,
                        score: score,
                        maxScore: 100,
                        teacher: subject.teacher,
                        remarks: score >= 90 ? "Excellent!" : score >= 75 ? "Good work" : "Keep improving",
                        gradedAt: randomDate(new Date(2025, 0, 1), new Date()),
                    });
                    gradeCount++;
                }
            }
        }
        console.log(`✅ Created ${gradeCount} grade records`);

        // 12. Create Assignments
        console.log("\\n📝 Creating assignments...");
        const assignments = [];
        for (const subject of subjects) {
            for (let i = 0; i < 3; i++) {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) - 15); // -15 to +15 days

                const assignment = await Assignment.create({
                    title: `${subject.name} Assignment ${i + 1}`,
                    description: `Complete the ${subject.name} exercises and submit your work.`,
                    subject: subject._id,
                    teacher: subject.teacher,
                    classLevel: classes[Math.floor(Math.random() * classes.length)]._id,
                    academicYear: academicYear._id,
                    academicTerm: terms[0]._id,
                    schoolId: school._id,
                    dueDate: dueDate,
                    totalPoints: 100,
                    status: dueDate > new Date() ? "published" : "closed",
                });
                assignments.push(assignment);
            }
        }
        console.log(`✅ Created ${assignments.length} assignments`);

        // 13. Create Attendance Records
        console.log("\\n📅 Creating attendance records...");
        let attendanceCount = 0;
        const statuses = ["present", "absent", "late", "excused"];
        const today = new Date();

        // Create attendance for last 30 days (per class, not per student)
        for (let day = 0; day < 30; day++) {
            const date = new Date(today);
            date.setDate(date.getDate() - day);

            // Skip weekends
            if (date.getDay() === 0 || date.getDay() === 6) continue;

            // Create attendance record for each class
            for (const classLevel of classes) {
                // Get students in this class
                const studentsInClass = students.filter(s => s.classIndex === classes.indexOf(classLevel));

                // Create records array for all students in this class
                const records = studentsInClass.map(student => ({
                    student: student._id,
                    status: Math.random() < 0.9 ? "present" : randomFrom(statuses),
                    remarks: "",
                }));

                await Attendance.create({
                    schoolId: school._id,
                    academicYear: academicYear._id,
                    academicTerm: terms[0]._id,
                    classLevel: classLevel._id,
                    date: date,
                    records: records,
                    takenBy: teachers[0]._id,
                });
                attendanceCount++;
            }
        }
        console.log(`✅ Created ${attendanceCount} attendance records`);

        // 14. Create Fee Structures
        console.log("\\n💰 Creating fee structures...");
        const feeStructures = [];
        const feeData = [
            { name: "Tuition Fee", amount: 5000, type: "tuition" },
            { name: "Library Fee", amount: 200, type: "library" },
            { name: "Lab Fee", amount: 300, type: "lab" },
            { name: "Transport Fee", amount: 800, type: "transport" },
            { name: "Sports Fee", amount: 150, type: "sports" },
        ];

        for (const fee of feeData) {
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + 1);

            const feeStructure = await FeeStructure.create({
                name: fee.name,
                amount: fee.amount,
                feeType: fee.type,
                academicYear: academicYear._id,
                academicTerm: terms[0]._id,
                classLevel: classes[0]._id, // Apply to all classes
                schoolId: school._id,
                dueDate: dueDate,
                createdBy: admin._id,
            });
            feeStructures.push(feeStructure);
        }
        console.log(`✅ Created ${feeStructures.length} fee structures`);

        // 15. Create Fee Payments
        console.log("\\n💳 Creating fee payments...");
        let paymentCount = 0;
        const paymentMethods = ["cash", "card", "bank_transfer", "online"];

        for (const student of students) {
            // Each student pays 2-4 fee types
            const numPayments = Math.floor(Math.random() * 3) + 2;
            const selectedFees = [];

            for (let i = 0; i < numPayments; i++) {
                const fee = randomFrom(feeStructures);
                if (selectedFees.includes(fee._id.toString())) continue;
                selectedFees.push(fee._id.toString());

                // 60% chance of full payment, 40% partial
                const amountPaid = Math.random() < 0.6 ? fee.amount : Math.floor(fee.amount * 0.5);
                const amountDue = fee.amount - amountPaid;

                await FeePayment.create({
                    student: student._id,
                    feeStructure: fee._id,
                    amountPaid: amountPaid,
                    amountDue: amountDue,
                    paymentMethod: randomFrom(paymentMethods),
                    paymentDate: randomDate(new Date(2025, 0, 1), new Date()),
                    status: amountPaid >= fee.amount ? "paid" : "partial",
                    schoolId: school._id,
                    recordedBy: admin._id,
                });
                paymentCount++;
            }
        }
        console.log(`✅ Created ${paymentCount} fee payment records`);

        // Final Summary
        console.log("\\n" + "=".repeat(60));
        console.log("✨ COMPREHENSIVE DATABASE SEEDING COMPLETED!\\n");
        console.log("📊 Summary:");
        console.log("─".repeat(60));
        console.log(`✅ School: ${school.name}`);
        console.log(`✅ Classes: ${classes.length}`);
        console.log(`✅ Subjects: ${subjects.length}`);
        console.log(`✅ Teachers: ${teachers.length}`);
        console.log(`✅ Students: ${students.length}`);
        console.log(`✅ Enrollments: ${enrollmentCount}`);
        console.log(`✅ Grades: ${gradeCount}`);
        console.log(`✅ Assignments: ${assignments.length}`);
        console.log(`✅ Attendance Records: ${attendanceCount}`);
        console.log(`✅ Fee Structures: ${feeStructures.length}`);
        console.log(`✅ Fee Payments: ${paymentCount}`);
        console.log("─".repeat(60));
        console.log("\\n🔐 Login Credentials:\\n");
        console.log("SUPER ADMIN:");
        console.log("  Email: superadmin@school.com");
        console.log("  Password: superadmin123");
        console.log("\\nADMIN:");
        console.log("  Email: admin@school.com");
        console.log("  Password: admin123");
        console.log("\\nTEACHERS (all use password: teacher123):");
        teachers.forEach(t => console.log(`  - ${t.email}`));
        console.log("\\nSTUDENTS (all use password: student123):");
        students.slice(0, 5).forEach(s => console.log(`  - ${s.email}`));
        console.log(`  ... and ${students.length - 5} more students`);
        console.log("\\n" + "=".repeat(60) + "\\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding error:", error.message);
        console.error(error);
        process.exit(1);
    }
};

// Run seeding
seedDatabase();
