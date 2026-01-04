/**
 * Comprehensive Muslim-focused seed script.
 * - Clears prior demo data for the target school/email.
 * - Seeds school, admin, class levels, terms, teachers, subjects, students, enrollments, and grades.
 * Run with: node backend/seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

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

const DB = process.env.DB || process.env.MONGO_URI || "mongodb://localhost:27017/school-management";

const log = (msg) => console.log(msg);
const hashPassword = async (password) => bcryptjs.hash(password, await bcryptjs.genSalt(10));
const pick = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function connectDB() {
  await mongoose.connect(DB);
  log("✅ Database connected");
}

async function clearExisting(schoolEmail) {
  const existingSchool = await School.findOne({ email: schoolEmail });
  if (!existingSchool) return;

  const schoolId = existingSchool._id;
  log(`⚠️  Removing existing data for ${schoolEmail}`);

  await Promise.all([
    Admin.deleteMany({ schoolId }),
    Teacher.deleteMany({ schoolId }),
    Student.deleteMany({ schoolId }),
    AcademicYear.deleteMany({ schoolId }),
    AcademicTerm.deleteMany({ schoolId }),
    ClassLevel.deleteMany({ schoolId }),
    Subject.deleteMany({ schoolId }),
    Enrollment.deleteMany({ schoolId }),
    Grade.deleteMany({ schoolId }),
  ]);

  await School.deleteOne({ _id: schoolId });
  log("✅ Cleared previous demo records for this school");
}

async function seed() {
  await connectDB();
  log("\n🌱 Seeding Muslim demo data...\n");

  const schoolProfile = {
    name: "Nurul Huda Academy",
    email: "hello@school.demo",
    phone: "+971-50-123-4567",
    address: {
      street: "12 Crescent Road",
      city: "Dubai",
      state: "Dubai",
      country: "UAE",
      zipCode: "00000",
    },
    logo: "",
    primaryColor: "#0EA5E9",
    secondaryColor: "#10B981",
    subscription: {
      plan: "standard",
      status: "active",
      startDate: new Date(),
      endDate: (() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 3);
        return d;
      })(),
      limits: {
        maxStudents: 500,
        maxTeachers: 80,
        maxClasses: 150,
      },
    },
    features: {
      analytics: true,
      parentPortal: true,
      smsNotifications: true,
    },
  };

  await clearExisting(schoolProfile.email);

  const universalPassword = "progresslmspass";

  const school = await School.create(schoolProfile);
  log(`✅ School created: ${school.name}`);

  // Admin tied to school
  const adminEmail = "admin@school.demo";
  const admin = await Admin.findOneAndUpdate(
    { email: adminEmail },
    {
      name: "Ahmad Farooq",
      email: adminEmail,
      password: await hashPassword(universalPassword),
      role: "admin",
      schoolId: school._id,
      permissions: {
        manageStudents: true,
        manageTeachers: true,
        manageUsers: true,
        manageFees: true,
        viewReports: true,
      },
      createdBy: null,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  log("✅ Admin ready");

  // Academic year and terms
  const now = new Date();
  const startYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const academicYearDoc = await AcademicYear.create({
    name: `${startYear}-${startYear + 1}`,
    fromYear: new Date(startYear, 7, 1),
    toYear: new Date(startYear + 1, 6, 30),
    isCurrent: true,
    schoolId: school._id,
    createdBy: admin._id,
  });

  const termsSeed = [
    { name: "Term 1", description: "Muharram – Rabi al-Thani", duration: "4 months", isCurrent: true },
    { name: "Term 2", description: "Jumada – Sha'ban", duration: "4 months", isCurrent: false },
    { name: "Term 3", description: "Ramadan – Dhu al-Hijjah", duration: "4 months", isCurrent: false },
  ];

  const academicTerms = await AcademicTerm.insertMany(
    termsSeed.map((t) => ({
      ...t,
      academicYear: academicYearDoc._id,
      schoolId: school._id,
      createdBy: admin._id,
    }))
  );
  const currentTerm = academicTerms.find((t) => t.isCurrent) || academicTerms[0];

  // Class levels
  const classLevels = await ClassLevel.insertMany(
    [1, 2, 3, 4, 5].map((g) => ({
      name: `Grade ${g}`,
      description: `Primary grade ${g}`,
      schoolId: school._id,
      createdBy: admin._id,
    }))
  );
  const classLevelByName = Object.fromEntries(classLevels.map((c) => [c.name, c]));

  // Teachers
  const teacherSeeds = [
    "Fatimah Hasan",
    "Yusuf Rahman",
    "Amina Siddiqui",
    "Khalid Noor",
    "Layla Zahra",
    "Omar Qureshi",
    "Maryam Idris",
    "Bilal Kareem",
    "Zainab Malik",
    "Hamza Abdullah",
  ].map((name, idx) => ({
    name,
    email: `${name.toLowerCase().replace(/[^a-z]/g, ".")}@school.demo`,
    password: universalPassword,
  }));

  const teachers = await Promise.all(
    teacherSeeds.map(async (t, idx) => {
      const className = `Grade ${1 + (idx % classLevels.length)}`;
      const teacherId = `TEA${String(Date.now()).slice(-6)}${idx}`;
      return Teacher.findOneAndUpdate(
        { email: t.email },
        {
          name: t.name,
          email: t.email,
          password: await hashPassword(universalPassword),
          teacherId,
          role: "teacher",
          schoolId: school._id,
          createdBy: admin._id,
          classLevel: classLevelByName[className]._id,
          academicYear: academicYearDoc.name,
          academicTerm: currentTerm.name,
          status: "active",
        },
        { new: true, upsert: true, setDefaultsOnInsert: false }
      );
    })
  );
  const teacherByEmail = Object.fromEntries(teachers.map((t) => [t.email, t]));

  // Subjects mapped to teachers and class levels
  const subjectSeeds = [
    { name: "Qur'an Studies", classLevel: "Grade 1", teacher: teacherSeeds[0].email },
    { name: "Arabic Language", classLevel: "Grade 1", teacher: teacherSeeds[1].email },
    { name: "Mathematics", classLevel: "Grade 2", teacher: teacherSeeds[2].email },
    { name: "Science", classLevel: "Grade 2", teacher: teacherSeeds[3].email },
    { name: "Islamic History", classLevel: "Grade 3", teacher: teacherSeeds[4].email },
    { name: "English", classLevel: "Grade 3", teacher: teacherSeeds[5].email },
    { name: "Geography", classLevel: "Grade 4", teacher: teacherSeeds[6].email },
    { name: "Physical Education", classLevel: "Grade 4", teacher: teacherSeeds[7].email },
    { name: "Tajweed", classLevel: "Grade 5", teacher: teacherSeeds[8].email },
    { name: "Civics & Ethics", classLevel: "Grade 5", teacher: teacherSeeds[9].email },
  ];

  const subjects = await Subject.insertMany(
    subjectSeeds.map((s) => ({
      name: s.name,
      description: `${s.name} for ${s.classLevel}`,
      academicTerm: currentTerm._id,
      schoolId: school._id,
      createdBy: admin._id,
      teacher: teacherByEmail[s.teacher]._id,
    }))
  );

  const subjectTeacherById = {};
  const subjectsByClass = subjects.reduce((acc, subj, idx) => {
    const seed = subjectSeeds[idx];
    const clsName = seed.classLevel;
    acc[clsName] = acc[clsName] || [];
    acc[clsName].push(subj);
    subjectTeacherById[subj._id.toString()] = teacherByEmail[seed.teacher];
    return acc;
  }, {});

  // Students
  const studentNames = [
    "Aaliyah Khan",
    "Ibrahim Malik",
    "Noor Alvi",
    "Rayan Siddiq",
    "Huda Qadir",
    "Zayd Rahim",
    "Mariam Omar",
    "Taha Karim",
    "Safiya Idris",
    "Yahya Saleh",
    "Hafsa Rauf",
    "Elias Farid",
    "Amna Jamil",
    "Zara Yasin",
    "Sami Naeem",
    "Aisha Basit",
    "Usman Tariq",
    "Lina Habib",
    "Farah Imran",
    "Nabil Khan",
    "Sumayyah Ali",
    "Junaid Iqbal",
    "Sara Latif",
    "Mahmoud Saeed",
    "Anisa Parvez",
  ];

  const studentDocs = await Promise.all(
    studentNames.map(async (name, idx) => {
      const className = `Grade ${1 + (idx % classLevels.length)}`;
      const gender = idx % 2 === 0 ? "female" : "male";
      const email = `${name.toLowerCase().replace(/[^a-z]/g, ".")}@school.demo`;
      const studentId = `STU${String(Date.now()).slice(-6)}${idx}`;

      return Student.findOneAndUpdate(
        { email },
        {
          name,
          email,
          password: await hashPassword(universalPassword),
          studentId,
          role: "student",
          gender,
          schoolId: school._id,
          academicYear: academicYearDoc._id,
          currentClassLevels: [classLevelByName[className]._id],
          currentClassLevel: classLevelByName[className]._id,
          section: pickOne(["A", "B", "C"]),
          enrollmentStatus: "active",
        },
        { new: true, upsert: true, setDefaultsOnInsert: false }
      );
    })
  );

  // Enrollments and grades
  const gradesToCreate = [];
  const enrollments = [];

  for (const student of studentDocs) {
    const classDoc = classLevels.find((c) => c._id.equals(student.currentClassLevel));
    if (!classDoc) continue;
    const clsName = classDoc.name;
    const availableSubjects = subjectsByClass[clsName] || [];
    const subjectsForStudent = pick(availableSubjects, randRange(3, Math.min(availableSubjects.length, 5)));

    for (const subj of subjectsForStudent) {
      const enrollment = await Enrollment.findOneAndUpdate(
        {
          student: student._id,
          subject: subj._id,
          academicYear: academicYearDoc._id,
          academicTerm: currentTerm._id,
        },
        {
          student: student._id,
          subject: subj._id,
          classLevel: classLevelByName[clsName]._id,
          academicYear: academicYearDoc._id,
          academicTerm: currentTerm._id,
          schoolId: school._id,
          status: "active",
          progress: randRange(40, 96),
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      enrollments.push(enrollment);

      const teacher = subjectTeacherById[subj._id.toString()] || pickOne(teachers);

      const quizScore = randRange(70, 98);
      const examScore = randRange(68, 96);

      gradesToCreate.push(
        {
          student: student._id,
          subject: subj._id,
          classLevel: classLevelByName[clsName]._id,
          academicYear: academicYearDoc._id,
          academicTerm: currentTerm._id,
          schoolId: school._id,
          assessmentType: "quiz",
          examName: `${subj.name} - Quiz ${randRange(1, 2)}`,
          score: quizScore,
          maxScore: 100,
          teacher: teacher._id,
          remarks: quizScore > 90 ? "Excellent grasp" : "Steady progress",
        },
        {
          student: student._id,
          subject: subj._id,
          classLevel: classLevelByName[clsName]._id,
          academicYear: academicYearDoc._id,
          academicTerm: currentTerm._id,
          schoolId: school._id,
          assessmentType: "exam",
          examName: `${subj.name} - Midterm`,
          score: examScore,
          maxScore: 100,
          teacher: teacher._id,
          remarks: examScore > 85 ? "Great effort" : "Needs practice on key units",
        }
      );
    }
  }

  // Persist grades without duplicates on examName per student/subject
  for (const grade of gradesToCreate) {
    const exists = await Grade.findOne({
      student: grade.student,
      subject: grade.subject,
      examName: grade.examName,
    });
    if (!exists) await Grade.create(grade);
  }

  log("\n" + "=".repeat(60));
  log("✨ Seeding completed");
  log("Demo credentials:");
  log("- Admin       | admin@school.demo        | " + universalPassword);
  log("- Teacher     | first teacher in list    | " + universalPassword);
  log("- Student     | first student in list    | " + universalPassword);
  log("=".repeat(60) + "\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding error:", err);
  process.exit(1);
});
