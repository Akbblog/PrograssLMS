const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("colors");

let isConnected = false;

const dbConnect = async () => {
  // Skip Mongoose/MongoDB connection if USE_PRISMA is enabled
  if (process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1') {
    console.log('[Database] USE_PRISMA is set. Skipping Mongoose/MongoDB connection.'.cyan);
    return;
  }

  if (isConnected) {
    return;
  }

  // Check if we have a connection
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  const uri = process.env.DB || process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "Database connection string missing. Set env var DB (or MONGO_URI)."
    );
  }

  // If we can't connect, don't allow Mongoose to buffer operations.
  // Buffering causes confusing timeouts like: admins.findOne() buffering timed out.
  mongoose.set("bufferCommands", false);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log("Database connected to:", mongoose.connection.db.databaseName);
  } catch (err) {
    isConnected = false;
    console.error(`Failed to connect database: ${err}`.red.bold);
    throw err;
  }
};

module.exports = dbConnect;

