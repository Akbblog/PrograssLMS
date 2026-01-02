/**
 * Test Login Endpoints
 * This script tests all login endpoints to verify they're working correctly
 */

const axios = require('axios');

const baseURL = process.env.API_URL || 'http://localhost:3000/api/v1';

// Test credentials
const testCreds = {
  admin: { email: 'admin@school.com', password: 'admin123' },
  teacher: { email: 'teacher1@progress.edu', password: 'teacher123' },
  student: { email: 'student1@progress.edu', password: 'student123' },
};

const testEndpoints = [
  { name: 'Admin Login', endpoint: '/admin/login', creds: testCreds.admin },
  { name: 'Teacher Login', endpoint: '/teachers/login', creds: testCreds.teacher },
  { name: 'Student Login', endpoint: '/students/login', creds: testCreds.student },
  { name: 'Superadmin Login', endpoint: '/superadmin/login', creds: { email: 'superadmin@progress.edu', password: 'superadmin123' } },
];

async function testLoginEndpoints() {
  console.log('🧪 Testing Login Endpoints...\n');
  console.log(`Base URL: ${baseURL}\n`);

  for (const test of testEndpoints) {
    try {
      console.log(`Testing: ${test.name} (${test.endpoint})`);
      const response = await axios.post(`${baseURL}${test.endpoint}`, test.creds);
      
      if (response.status === 200) {
        console.log(`✅ SUCCESS - Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);
      } else {
        console.log(`⚠️  Unexpected Status: ${response.status}\n`);
      }
    } catch (error) {
      console.log(`❌ ERROR - ${error.response?.status || error.code || 'No Status'}`);
      console.log(`   Message: ${error.response?.data?.message || error.message}`);
      console.log(`   Error code: ${error.code || 'N/A'}`);
      console.log(`   Error stack: ${error.stack?.split('\n')[0] || 'N/A'}`);
      console.log(`   Full Error Response: ${JSON.stringify(error.response?.data || (error.toJSON ? error.toJSON() : null), null, 2)}\n`);
    }
  }
}

testLoginEndpoints();
