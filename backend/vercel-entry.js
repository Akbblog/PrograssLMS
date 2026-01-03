const app = require("./app/app");
const dbConnect = require("./config/dbConnect");

// Connect to database
dbConnect();

module.exports = app;
