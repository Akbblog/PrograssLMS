require("dotenv").config();
const mongoose = require("mongoose");

const DB = process.env.DB || process.env.MONGO_URI || "mongodb://localhost:27017/school-management";

async function checkData() {
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