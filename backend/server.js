const http = require("http");
const app = require("./app/app");
require("dotenv").config();
require("colors");
// database connection
const dbConnect = require("./config/dbConnect");
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

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

(async () => {
  await dbConnect();

  server.listen(port, () => {
    console.log(` server is running on port : ${port} `.black.bgGreen.bold);
  });
})().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
