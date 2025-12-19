require('dotenv').config();
const mongoose = require('mongoose');
require('../config/dbConnect');

async function main() {
  try {
    // Safety checks
    const env = process.env.NODE_ENV || 'development';
    const allow = process.env.ALLOW_DESTRUCTIVE === '1' || process.env.ALLOW_DESTRUCTIVE === 'true';
    if (env !== 'development' && !allow) {
      console.error('Refusing to run DB destructive operation: NODE_ENV != development and ALLOW_DESTRUCTIVE not set');
      process.exit(1);
    }

    console.log('Connected to DB — dropping database now...');
    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to drop database:', err);
    process.exit(2);
  }
}

main();
