const http = require("http");
const app = require("./app/app");
require("dotenv").config();
require("colors");
// database connection
require("./config/dbConnect");
// ports
const port = process.env.PORT || 3001;
// initialize server
const server = http.createServer(app);

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

server.listen(port, () => {
  console.log(` server is running on port : ${port} `.black.bgGreen.bold);
});
