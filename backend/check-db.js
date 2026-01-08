require("dotenv").config();
const mongoose = require("mongoose");

const DB = process.env.DB || process.env.MONGO_URI || "mongodb://localhost:27017/school-management";

async function checkData() {
  // Skip MongoDB checks if USE_PRISMA is enabled
  if (process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1') {
    console.log('✅ USE_PRISMA is enabled. Skipping MongoDB checks.');
    console.log('📦 Using MySQL via Prisma. DATABASE_URL:', process.env.DATABASE_URL ? '[configured]' : '[not set]');
    
    // Optionally check Prisma connection
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.$connect();
      
      const adminCount = await prisma.admin.count();
      const teacherCount = await prisma.teacher.count();
      const studentCount = await prisma.student.count();
      const schoolCount = await prisma.school.count();
      
      console.log('\n📊 MySQL/Prisma Database Stats:');
      console.log('   Schools:', schoolCount);
      console.log('   Admins:', adminCount);
      console.log('   Teachers:', teacherCount);
      console.log('   Students:', studentCount);
      
      await prisma.$disconnect();
    } catch (prismaErr) {
      console.error('❌ Prisma connection error:', prismaErr.message);
    }
    return;
  }
  
  try {
    await mongoose.connect(DB);
    console.log("✅ Connected to DB:", mongoose.connection.db.databaseName);
    console.log("🔗 Connection URI from env:", DB);

    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map((col) => col.name));

    const school = await db.collection('schools').findOne({ email: "hello@school.demo" });
    console.log("School doc:", school ? { name: school.name, email: school.email, _id: school._id } : "not found");

    const admin = await db.collection('admins').findOne({ email: "admin@school.demo" });
    console.log("Admin doc:", admin ? { name: admin.name, email: admin.email, _id: admin._id } : "not found");

    const teachers = await db.collection('teachers').countDocuments();
    console.log("Teachers count:", teachers);

    const students = await db.collection('students').countDocuments();
    console.log("Students count:", students);

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

checkData();