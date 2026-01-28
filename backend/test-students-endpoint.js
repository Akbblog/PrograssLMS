const axios = require('axios');
const baseURL = 'http://localhost:3001/api/v1';

async function test() {
  try {
    // Login as teacher
    const loginRes = await axios.post(`${baseURL}/teachers/login`, {
      email: 'owais.malik@starschool.com',
      password: 'teacher123'
    });
    const token = loginRes.data.data.token;
    const classId = 'class-101'; // Try a sample class ID
    
    console.log(`Testing /students?currentClassLevel=${classId} with teacher token...\n`);
    
    const studentsRes = await axios.get(`${baseURL}/students?currentClassLevel=${classId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Students retrieved successfully');
    console.log('Students count:', studentsRes.data.data?.students?.length || 0);
    console.log('Pagination:', studentsRes.data.data?.pagination);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
    console.error('Status:', error.response?.status);
  }
}

test();
