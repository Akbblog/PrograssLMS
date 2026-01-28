const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const baseURL = process.env.API_URL || 'http://localhost:3001/api/v1';

async function test() {
  try {
    console.log('Testing teacher login...');
    const loginRes = await axios.post(`${baseURL}/teachers/login`, {
      email: 'owais.malik@starschool.com',
      password: 'teacher123'
    });

    const token = loginRes.data.data.token;
    console.log('✅ Login successful');
    console.log('Token:', token.substring(0, 30) + '...');

    console.log('\nTesting PATCH /teacher/update-profile...');
    const updateRes = await axios.patch(`${baseURL}/teacher/update-profile`, 
      { phone: '+92-1234567890' },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    console.log('✅ Update successful');
    console.log('Response:', JSON.stringify(updateRes.data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
  }
}

test();
