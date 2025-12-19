const mongoose = require("mongoose");
require("dotenv").config();
require("colors");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Database connected! ".yellow.bold);
  } catch (err) {
    console.error(`Failed to connect database: ${err}`.red.bold);
    console.error(err.stack);
  }
};

dbConnect();

