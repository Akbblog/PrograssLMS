const axios = require('axios');

const baseURL = 'http://localhost:3001/api/v1';

async function test() {
  try {
    console.log('Testing POST /teachers/login...');
    const res = await axios.post(`${baseURL}/teachers/login`, {
      email: 'owais.malik@starschool.com',
      password: 'teacher123'
    });
    console.log('✅ Success');
    console.log('Token:', res.data.data.token.substring(0, 30) + '...');
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
  }
}

test();
