
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Testing connection to:', process.env.DB);
        await mongoose.connect(process.env.DB);
        console.log('✅ Database connected!');

        // Check if we can find any user
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('✅ Collections found:', collections.map(c => c.name).join(', '));

        process.exit(0);
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }
}

testConnection();
