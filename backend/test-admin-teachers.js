const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const baseURL = 'http://localhost:3001/api/v1';

async function test() {
  try {
    // Login as admin
    const adminLoginRes = await axios.post(`${baseURL}/admin/login`, {
      email: 'superadmin@progresslms.com',
      password: 'Superpass'
    });
    const adminToken = adminLoginRes.data.data.token;
    console.log('✅ Admin logged in');

    // Try accessing /admin/teachers with admin token
    const teachersRes = await axios.get(`${baseURL}/admin/teachers`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ /admin/teachers works');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
    console.error('Status:', error.response?.status);
  }
}

test();
