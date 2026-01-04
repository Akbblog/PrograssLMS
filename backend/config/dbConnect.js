const mongoose = require("mongoose");
require("dotenv").config();
require("colors");

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) {
    return;
  }

  // Check if we have a connection
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    await mongoose.connect(process.env.DB);
    isConnected = true;
    console.log("Database connected to:", mongoose.connection.db.databaseName);
  } catch (err) {
    console.error(`Failed to connect database: ${err}`.red.bold);
    console.error(err.stack);
  }
};

module.exports = dbConnect;

