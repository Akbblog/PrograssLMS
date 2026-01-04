require("dotenv").config();
const mongoose = require("mongoose");

const DB = process.env.DB || process.env.MONGO_URI || "mongodb://localhost:27017/school-management";

async function checkData() {
  try {
    await mongoose.connect(DB);
    console.log("✅ Connected to DB:", mongoose.connection.db.databaseName);

    const db = mongoose.connection.db;

    const schools = await db.collection('schools').find({}).toArray();
    console.log("All schools:", schools.length);

    const admins = await db.collection('admins').find({}).toArray();
    console.log("All admins:", admins.length);

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